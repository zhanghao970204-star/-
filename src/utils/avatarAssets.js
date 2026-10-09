import { createAssetResolver } from './assetResolver'

const avatarModules = import.meta.glob(
  "@/assets/img/avatar/*.{png,jpg,jpeg,gif,webp,svg}",
  { eager: true, import: "default" },
);

const resolveAvatar = createAssetResolver(avatarModules);

export const AVATAR_COUNT = 16;

export function avatarImg(index) {
  if (index == null || index === "") return "";
  // 兼容后端直接返回完整图片地址
  if (typeof index === "string" && /^https?:\/\//i.test(index)) {
    return index;
  }
  const i = Number(index);
  if (!Number.isFinite(i) || i < 0) return "";
  return (
    resolveAvatar(`avatar_${i}.png`) ||
    resolveAvatar(`avatar_${i}.jpg`) ||
    resolveAvatar(`avatar_${i}.jpeg`) ||
    resolveAvatar(`avatar_${i}.webp`) ||
    ""
  );
}
