<script setup>
import { toast } from "vue-sonner";
import { z } from "zod";

const LoginSchema = z.object({
  user: z.string().describe("Login Email"),
  pass: z.string().describe("Login Password"),
});

const loginFieldConfig = {
  user: {
    inputProps: { type: "test" },
  },
  pass: {
    inputProps: { type: "password" },
  },
};

async function onSubmit(form) {
  try {
    $persist("WebAppToken", encodeUserPass(form?.user, form?.pass));
    const data = await useApi("/api/verify");
    $persist("WebAppData", data);
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
