import { heroui } from "@heroui/theme";
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@heroui/theme/dist/components/(popover|button|ripple|spinner).js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        "pale-teal-green": "#008080",
        "dark-teal-green": "rgb(23, 114, 110)",
        "darker-teal-green": "rgb(19, 96, 92)",
      },
    },
  },
  plugins: [heroui()],
} satisfies Config;
