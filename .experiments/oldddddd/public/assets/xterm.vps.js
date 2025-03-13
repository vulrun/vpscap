const ASCII = {
  NULL: 0,
  START_OF_HEADER: 1,
  START_OF_TEXT: 2,
  END_OF_TEXT: 3,
  END_OF_TRANSMISSION: 4,
  ENQUIRY: 5,
  ACKNOWLEDGE: 6,
  BELL: 7,
  BACKSPACE: 8,
  HORIZONTAL_TAB: 9,
  LINE_FEED: 10,
  VERTICAL_TAB: 11,
  FORM_FEED: 12,
  CARRIAGE_RETURN: 13,
  SHIFT_OUT: 14,
  SHIFT_IN: 15,
  DATA_LINK_ESCAPE: 16,
  DEVICE_CONTROL_1: 17,
  DEVICE_CONTROL_2: 18,
  DEVICE_CONTROL_3: 19,
  DEVICE_CONTROL_4: 20,
  NEGATIVE_ACKNOWLEDGE: 21,
  SYNCHRONIZE: 22,
  END_TRANSMISSION_BLOCK: 23,
  CANCEL: 24,
  END_OF_MEDIUM: 25,
  SUBSTITUTE: 26,
  ESCAPE: 27,
  FILE_SEPARATOR: 28,
  GROUP_SEPARATOR: 29,
  RECORD_SEPARATOR: 30,
  UNIT_SEPARATOR: 31,
  SPACE: 32,
  DELETE: 127,
};

const ESCAPE_SEQ = {
  UP_ARROW: "[A",
  DOWN_ARROW: "[B",
  RIGHT_ARROW: "[C",
  LEFT_ARROW: "[D",
  DELETE: "[3~",
  END: "[F",
  HOME: "[H",
  ALT_LEFT: "b",
  ALT_RIGHT: "f",
  CTRL_BACKSPACE: 0x7f,
};

class VPS {
  constructor(socket) {
    this.socket = socket;
    this.terminal = new Terminal({ convertEol: true, background: "#112233" });
    this._input = "";
    this._cursor = 0;
    this._prompt = `${window.location.host}:$ `;
    this._termSize = { cols: 0, rows: 0 };
  }

  // container is a #terminal
  attachTo(container) {
    this.terminal.open(document.querySelector(container));
    this.terminal.fit();
    window.addEventListener("resize", () => this.terminal.fit());
    this.print("\n");
    this.prompt();
  }

  // attach event listeners for terminal UI and socket.io client
  startListening() {
    this.terminal.onData((data) => this.handleTermData(data));

    this.socket.on(`vpsTerm:error`, (err) => {
      this.error(err);
    });
    this.socket.on(`vpsTerm:data`, (log) => {
      this.println(log);
    });
    this.socket.on(`vpsTerm:info`, (data) => {
      console.log("vpsTerm:info", data);
      if (data.includes("closed")) {
        this.print("\n");
        this.prompt();
      }
    });
  }

  // send whatever you type to backend server
  sendKill(pid) {
    console.log("🚀 ~ TerminalUI ~ sendKill ~ pid:", pid);
    this.socket.emit(`vpsTerm:kill`, pid);
  }

  sendCommand(val) {
    if (!val.length) return;
    console.log("🚀 ~ TerminalUI ~ sendCommand ~ val:", val);
    this.socket.emit(`vpsTerm:cmd`, val);
  }

  // hit backspace
  backSpace() {
    this.terminal.write("\b \b");
  }

  // clear the input given
  clearInput(inp) {
    inp = inp || this._input;
    for (let i = 0; i < inp.length; i++) {
      this.backSpace();
    }
  }

  // clear full terminal
  clear() {
    this.terminal.clear();
  }

  write(txt) {
    if (!txt) return;
    this.terminal.write(txt);
  }

  // prints a message and properly handles new-lines
  print(message) {
    const normInput = message.replace(/[\r\n]+/g, "\n");
    this.terminal.write(normInput.replace(/\n/g, "\r\n"));
  }

  // prints a message and changes line
  println(message) {
    this.print(message + "\n");
  }

  printWide(items, padding = 2) {
    if (items.length == 0) return this.println("");

    // Compute item sizes and matrix row/cols
    const itemWidth = items.reduce((width, item) => Math.max(width, item.length), 0) + padding;
    const wideCols = Math.floor(this._termSize.cols / itemWidth);
    const wideRows = Math.ceil(items.length / wideCols);

    // Print matrix
    let i = 0;
    for (let row = 0; row < wideRows; ++row) {
      let rowStr = "";

      // Prepare columns
      for (let col = 0; col < wideCols; ++col) {
        if (i < items.length) {
          let item = items[i++];
          item += " ".repeat(itemWidth - item.length);
          rowStr += item;
        }
      }
      this.println(rowStr);
    }
  }

  prompt() {
    this.terminal.write(this._prompt);
  }

  error(txt) {
    this.terminal.write(`\x1B[1;3;31m${txt}\x1B[0m`);
  }

  // Handle terminal input
  handleTermData(data) {
    // if this looks like a pasted input, expand it
    if (data.length > 3 && data.charCodeAt(0) !== 0x1b) {
      const normData = data.replace(/[\r\n]+/g, "\r");
      Array.from(normData).forEach((c) => this.handleData(c));
    } else {
      this.handleData(data);
    }
  }

  // Handle a single piece of information from the terminal.
  handleData(data) {
    const ord = data.charCodeAt(0);
    switch (ord) {
      case ASCII.ESCAPE: // Handle ANSI escape sequences
        this.handleEscapeSequence(data.substring(1));
        break;

      case ASCII.HORIZONTAL_TAB: // TAB
        this.handleAutoComplete();
        break;

      case ASCII.BACKSPACE: // BACKSPACE
      case ASCII.DELETE: // BACKSPACE
        this.handleCursorErase(true);
        break;

      case ASCII.CARRIAGE_RETURN: // CARRIAGE RETURN
        if (isIncompleteInput(this._input)) {
          this.handleCursorInsert("\n");
        } else if (!this._input.length) {
          this.print("\n");
          this.prompt();
        } else {
          this.clearInput(this._input);
          this.sendCommand(this._input);
          this._input = "";
          this._cursor = 0;
        }
        break;

      case ASCII.END_OF_TEXT: // CTRL+C
        this.setCursor(this._input.length);
        this.sendKill();
        this.print("^C\n");
        this.prompt();
        this._input = "";
        this._cursor = 0;
        break;

      default: // handle visible characters
        if (ord < ASCII.SPACE || ord === ASCII.DELETE) break;

        this.handleCursorInsert(data);
        break;
    }
  }

  handleEscapeSequence(str) {
    let ofs;
    switch (str) {
      case ESCAPE_SEQ.UP_ARROW: // Up arrow
        // if (this.history) {
        //   let value = this.history.getPrevious();
        //   if (value) {
        //     this.setInput(value);
        //     this.setCursor(value.length);
        //   }
        // }
        break;

      case ESCAPE_SEQ.DOWN_ARROW: // Down arrow
        // if (this.history) {
        //   let value = this.history.getNext();
        //   if (!value) value = "";
        //   this.setInput(value);
        //   this.setCursor(value.length);
        // }
        break;

      case ESCAPE_SEQ.LEFT_ARROW: // Left Arrow
        this.handleCursorMove(-1);
        break;

      case ESCAPE_SEQ.RIGHT_ARROW: // Right Arrow
        this.handleCursorMove(1);
        break;

      case ESCAPE_SEQ.DELETE: // Delete
        this.handleCursorErase(false);
        break;

      case ESCAPE_SEQ.END: // End
        this.setCursor(this._input.length);
        break;

      case ESCAPE_SEQ.HOME: // Home
        this.setCursor(0);
        break;

      case ESCAPE_SEQ.ALT_LEFT: // ALT + LEFT
        ofs = closestLeftBoundary(this._input, this._cursor);
        if (ofs != null) this.setCursor(ofs);
        break;

      case ESCAPE_SEQ.ALT_RIGHT: // ALT + RIGHT
        ofs = closestRightBoundary(this._input, this._cursor);
        if (ofs != null) this.setCursor(ofs);
        break;

      case ESCAPE_SEQ.CTRL_BACKSPACE: // CTRL + BACKSPACE
        ofs = closestLeftBoundary(this._input, this._cursor);
        if (ofs != null) {
          this.setInput(this._input.substring(0, ofs) + this._input.substring(this._cursor));
          this.setCursor(ofs);
        }
        break;
    }
  }

  handleAutoComplete() {
    // if (this._autocompleteHandlers.length > 0) {
    //   const inputFragment = this._input.substring(0, this._cursor);
    //   const hasTailingSpace = hasTailingWhitespace(inputFragment);
    //   const candidates = collectAutocompleteCandidates(this._autocompleteHandlers, inputFragment);
    //   // Sort candidates
    //   candidates.sort();
    //   // Depending on the number of candidates, we are handing them in
    //   // a different way.
    //   if (candidates.length === 0) {
    //     // No candidates? Just add a space if there is none already
    //     if (!hasTailingSpace) {
    //       this.handleCursorInsert(" ");
    //     }
    //   } else if (candidates.length === 1) {
    //     // Just a single candidate? Complete
    //     const lastToken = getLastToken(inputFragment);
    //     this.handleCursorInsert(candidates[0].substring(lastToken.length) + " ");
    //   } else if (candidates.length <= this.maxAutocompleteEntries) {
    //     // search for a shared fragement
    //     const sameFragment = getSharedFragment(inputFragment, candidates);
    //     // if there's a shared fragement between the candidates
    //     // print complete the shared fragment
    //     if (sameFragment) {
    //       const lastToken = getLastToken(inputFragment);
    //       this.handleCursorInsert(sameFragment.substring(lastToken.length));
    //     }
    //     // If we are less than maximum auto-complete candidates, print
    //     // them to the user and re-start prompt
    //     this.printAndRestartPrompt(() => {
    //       this.printWide(candidates);
    //     });
    //   } else {
    //     // If we have more than maximum auto-complete candidates, print
    //     // them only if the user acknowledges a warning
    //     this.printAndRestartPrompt(() =>
    //       this.readChar(`Display all ${candidates.length} possibilities? (y or n)`).then((yn) => {
    //         if (yn == "y" || yn == "Y") {
    //           this.printWide(candidates);
    //         }
    //       })
    //     );
    //   }
    // } else {
    //   this.handleCursorInsert("    ");
    // }
  }

  // Erase a character at cursor location
  handleCursorErase(backspace) {
    if (backspace) {
      if (this.terminal._core.buffer.x <= this._prompt.length) return;
      if (this._cursor <= 0) return;

      this._cursor -= 1;
      this.backSpace();
    }
    const newInput = this._input.substring(0, this._cursor) + this._input.substring(this._cursor + 1);
    this.setInput(newInput);
  }

  // Insert character at cursor location
  handleCursorInsert(data) {
    const newInput = this._input.substring(0, this._cursor) + data + this._input.substring(this._cursor);
    this.setInput(newInput);
    this.setCursor(newInput.length);
    this.print(data);
  }

  // Move cursor at given direction
  handleCursorMove(dir) {
    return;
    if (dir > 0) {
      const num = Math.min(dir, this._input.length - this._cursor);
      this.setCursor(this._cursor + num);
    } else if (dir < 0) {
      const num = Math.max(dir, -this._cursor);
      this.setCursor(this._cursor + num);
    }
  }

  // Replace input with the new input given
  setInput(newInput, clearInput = true) {
    // Clear current input
    // if (clearInput) {
    //   this.clearInput(this._prompt + this.input);
    // }

    // Trim cursor overflow
    if (this._cursor > newInput.length) {
      this._cursor = newInput.length;
    }

    // Replace input
    this._input = newInput;
    // this.print(this._prompt + newInput);
    window.DEBUG && console.log("🚀 ~ VPS ~ setInput ~ newInput :", newInput);
  }

  // Set the new cursor position, as an offset on the input string
  setCursor(newCursor) {
    if (newCursor < 0) newCursor = 0;
    if (newCursor > this._input.length) newCursor = this._input.length;

    // // Apply prompt formatting to get the visual status of the display
    // const inputWithPrompt = this.applyPrompts(this._input);
    // const inputLines = countLines(inputWithPrompt, this._termSize.cols);

    // // Estimate previous cursor position
    // const prevPromptOffset = this.applyPromptOffset(this._input, this._cursor);
    // const { col: prevCol, row: prevRow } = offsetToColRow(inputWithPrompt, prevPromptOffset, this._termSize.cols);

    // // Estimate next cursor position
    // const newPromptOffset = this.applyPromptOffset(this._input, newCursor);
    // const { col: newCol, row: newRow } = offsetToColRow(inputWithPrompt, newPromptOffset, this._termSize.cols);

    // // Adjust vertically
    // if (newRow > prevRow) {
    //   for (let i = prevRow; i < newRow; ++i) this.term.write("\x1B[B");
    // } else {
    //   for (let i = newRow; i < prevRow; ++i) this.term.write("\x1B[A");
    // }

    // // Adjust horizontally
    // if (newCol > prevCol) {
    //   for (let i = prevCol; i < newCol; ++i) this.term.write("\x1B[C");
    // } else {
    //   for (let i = newCol; i < prevCol; ++i) this.term.write("\x1B[D");
    // }

    // Set new offset
    this._cursor = newCursor;
    window.DEBUG && console.log("🚀 ~ VPS ~ setInput ~ this._cursor :", this._cursor);
  }

  // Clears the current prompt
  clearLine() {
    const currentPrompt = this.applyPrompts(this._input);

    // Get the overall number of lines to clear
    const allRows = countLines(currentPrompt, this._termSize.cols);

    // Get the line we are currently in
    const promptCursor = this.applyPromptOffset(this._input, this._cursor);
    const { col, row } = offsetToColRow(currentPrompt, promptCursor, this._termSize.cols);

    // First move on the last line
    const moveRows = allRows - row - 1;
    for (var i = 0; i < moveRows; ++i) this.term.write("\x1B[E");

    // Clear current input line(s)
    this.term.write("\r\x1B[K");
    for (var i = 1; i < allRows; ++i) this.term.write("\x1B[F\x1B[K");
  }
}

// Detects all the word boundaries on the given input
function wordBoundaries(input, leftSide = true) {
  let match;
  const words = [];
  const rx = /\w+/g;

  while ((match = rx.exec(input))) {
    if (leftSide) {
      words.push(match.index);
    } else {
      words.push(match.index + match[0].length);
    }
  }

  return words;
}

/**
 * The closest left (or right) word boundary of the given input at the
 * given offset.
 */
function closestLeftBoundary(input, offset) {
  const found = wordBoundaries(input, true)
    .reverse()
    .find((x) => x < offset);
  return found == null ? 0 : found;
}

function closestRightBoundary(input, offset) {
  const found = wordBoundaries(input, false).find((x) => x > offset);
  return found == null ? input.length : found;
}

/**
 * Convert offset at the given input to col/row location
 *
 * This function is not optimized and practically emulates via brute-force
 * the navigation on the terminal, wrapping when they reach the column width.
 */
function offsetToColRow(input, offset, maxCols) {
  let row = 0,
    col = 0;

  for (let i = 0; i < offset; ++i) {
    const chr = input.charAt(i);
    if (chr == "\n") {
      col = 0;
      row += 1;
    } else {
      col += 1;
      if (col > maxCols) {
        col = 0;
        row += 1;
      }
    }
  }

  return { row, col };
}

// Counts the lines in the given input
function countLines(input, maxCols) {
  return offsetToColRow(input, input.length, maxCols).row + 1;
}

/**
 * Checks if there is an incomplete input
 *
 * An incomplete input is considered:
 * - An input that contains unterminated single quotes
 * - An input that contains unterminated double quotes
 * - An input that ends with "\"
 * - An input that has an incomplete boolean shell expression (&& and ||)
 * - An incomplete pipe expression (|)
 */
function isIncompleteInput(input) {
  // Empty input is not incomplete
  if (input.trim() == "") {
    return false;
  }

  // Check for dangling single-quote strings
  if ((input.match(/'/g) || []).length % 2 !== 0) {
    return true;
  }
  // Check for dangling double-quote strings
  if ((input.match(/"/g) || []).length % 2 !== 0) {
    return true;
  }
  // Check for dangling boolean or pipe operations
  if (
    input
      .split(/(\|\||\||&&)/g)
      .pop()
      .trim() == ""
  ) {
    return true;
  }
  // Check for tailing slash
  if (input.endsWith("\\") && !input.endsWith("\\\\")) {
    return true;
  }

  return false;
}

// Returns true if the expression ends on a tailing whitespace
function hasTailingWhitespace(input) {
  return input.match(/[^\\][ \t]$/m) != null;
}
