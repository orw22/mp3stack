import { toast } from "@zerodevx/svelte-toast";

function createToast(color: string) {
  return (message: string) =>
    toast.push(message, {
      theme: {
        "--toastBackground": color,
        "--toastColor": "white",
        "--toastBarBackground": color,
      },
    });
}

const toasts = {
  success: createToast("#339966"),
  error: createToast("#cc3333"),
};

export default toasts;
