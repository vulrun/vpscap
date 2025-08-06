export default defineAppConfig({
  title: "VPS Panel",
  email: "dev@apii.in",
  description: "Urlly Link Shortener",
  icon: "/level-slider.svg",
  image: "https://images.unsplash.com/photo-1655196601100-8bfb26cf99e9?q=80&w=1200&h=630&fit=crop",
  slugRegex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
  reserveSlug: ["dashboard", "admin", "assets", "docs"],
});
