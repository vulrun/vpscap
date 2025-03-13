const NEWLINE = "\n";
const RE_NEWLINES = /\\n/g;
// const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const NEWLINES_MATCH = /\n|\r|\r\n/;

// Parses src into an Object
module.exports.parse = function (src /*: string | Buffer */, options /*: ?DotenvParseOptions */) /*: DotenvParseOutput */ {
    const debug = Boolean(options && options.debug);
    const obj = {};

    // convert Buffers before splitting into lines and processing
    String(src)
        .split(NEWLINES_MATCH)
        .forEach(function (line, idx) {
            // matching print.parse(diskFiles)"KEY' and 'VAL' in 'KEY=VAL'
            const keyValueArr = line.match(RE_INI_KEY_VAL);
            // matched?
            if (keyValueArr != null) {
                const key = keyValueArr[1];
                // default undefined or missing values to empty string
                let val = keyValueArr[2] || "";
                const end = val.length - 1;
                const isDoubleQuoted = val[0] === '"' && val[end] === '"';
                const isSingleQuoted = val[0] === "'" && val[end] === "'";

                // if single or double quoted, remove quotes
                if (isSingleQuoted || isDoubleQuoted) {
                    val = val.substring(1, end);

                    // if double quoted, expand newlines
                    if (isDoubleQuoted) {
                        val = val.replace(RE_NEWLINES, NEWLINE);
                    }
                } else {
                    // remove surrounding whitespace
                    val = val.trim();
                }

                obj[key] = val;
            } else if (debug) {
                log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
            }
        });

    return obj;
};

module.exports.tabular = (raw) => {
    let html = "";
    // html = JSON.stringify(raw, null, 2);
    return raw || "<table>" + html + "</table>";
};

// shell_exec('hostnamectl')
// $memory = '&nbsp;'.shell_exec('free -hltw');
// $memory_table = '<table class="table table-bordered table-striped"><thead>';

// $memory_rows = array_filter( explode("\n", $memory) );
// foreach ($memory_rows as $i => $row){
// 	if( $i == 0 ){
// 		$th = preg_replace('/([^\S]*)([^\s]+)/mi', '<th>$2</th>', $row);
// 		$memory_table .= "<tr>$th</tr></thead><tbody>";
// 	}
// 	else {
// 		$td = preg_replace('/([^\S]*)([^\s]+)/mi', '<td>$2</td>', $row);
// 		$td = preg_replace('/<td>([^\:]+?):<\/td>/mi', '<th>$1</th>', $td);
// 		$memory_table .= "<tr>$td</tr>";
// 	}
// }

// $memory_table .= '</tbody></table>';

// $diskFiles = shell_exec('df -h --total');
// $diskFiles = str_replace('Mounted on', 'Mounted', $diskFiles);
// $diskFiles_table = '<table class="table table-bordered table-striped"><thead>';

// $diskFiles_rows = array_filter( explode("\n", $diskFiles) );
// foreach ($diskFiles_rows as $i => $row){
// 	if( $i == 0 ){
// 		$th = preg_replace('/([^\S]*)([^\s]+)/mi', '<th>$2</th>', $row);
// 		$diskFiles_table .="<tr>$th</tr></thead><tbody>" ;
// 	}
// 	else {
// 		$td = preg_replace('/([^\S]*)([^\s]+)/mi', '<td>$2</td>', $row);
// 		$diskFiles_table .= "<tr>$td</tr>" ;
// 	}
// }

// $diskFiles_table .= '</tbody></table>';
