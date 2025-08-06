<script setup>
import { toast } from "vue-sonner";
import { z } from "zod";

const bgClass = ref("bg-gray-800");
const LoginSchema = z.object({
  username: z.string().describe("username"),
  password: z.string().describe("password"),
});

const loginFieldConfig = {
  username: {
    inputProps: {
      type: "test",
    },
  },
  password: {
    inputProps: {
      type: "password",
    },
  },
};

async function onSubmit(form) {
  try {
    localStorage.setItem("WebAppToken", encodeUserPass(form?.username, form?.password));
    await useApi("/api/verify");
    navigateTo("/home");
  } catch (err) {
    toast.error(err?.message, { description: "Login failed, please try again" });
  }
}
</script>

<template>
  <main class="w-full h-screen flex items-center justify-center">
    <SimpleCard class="w-full max-w-sm shadow-2xl grid gap-10">
      <div class="vstack text-center">
        <h1 class="text-xl">VPS-CAP</h1>
        <p class="text-sm text-gray-400">login into your vps admin</p>
      </div>

      <AutoForm class="grid gap-6" :schema="LoginSchema" :field-config="loginFieldConfig" @submit="onSubmit">
        <Button class="w-full h-12 text-md bg-gray-700 hover:bg-gray-800">Login</Button>
      </AutoForm>
    </SimpleCard>
  </main>
</template>
