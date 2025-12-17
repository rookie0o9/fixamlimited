import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

export function generateAvatar(name: string) {
  const avatar = createAvatar(initials, {
    seed: name,
    randomizeIds: true,
  });

  return avatar.toDataUri();
}
