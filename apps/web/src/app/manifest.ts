import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JERTINA",
    short_name: "JERTINA",
    description: "JERTINA commerce and technology platform",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    icons: [],
  };
}
