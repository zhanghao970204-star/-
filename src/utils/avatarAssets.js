const avatarModules = import.meta.glob(
  "@/assets/img/avatar/*.{png,jpg,jpeg,gif,webp,svg}",
  { eager: true, import: "default" },
);

function resolveFromGlob(modules, fileName) {
  const target = String(fileName);
  const entry = Object.entries(modules).find(([key]) =>
    key.endsWith(`/${target}`),
  );
  return entry ? entry[1] : "";
}

export const AVATAR_COUNT = 12;

export function avatarImg(index) {
  if (index == null || index === "") return "";
  // 兼容后端直接返回完整图片地址
  if (typeof index === "string" && /^https?:\/\//i.test(index)) {
    return index;
  }
  const i = Number(index);
  if (!Number.isFinite(i) || i < 0) return "";
  return (
    resolveFromGlob(avatarModules, `avatar_${i}.png`) ||
    resolveFromGlob(avatarModules, `avatar_${i}.jpg`) ||
    resolveFromGlob(avatarModules, `avatar_${i}.jpeg`) ||
    resolveFromGlob(avatarModules, `avatar_${i}.webp`) ||
    ""
  );
}
