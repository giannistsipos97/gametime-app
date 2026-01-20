import { PlatformType } from '../enums/enums';

export interface Platform {
  icon: string;
  label: string;
  value: PlatformType;
}

export const PLATFORMS: Platform[] = [
  { icon: 'fab fa-windows', label: 'Windows', value: PlatformType.WINDOWS },
  { icon: 'fa-brands fa-playstation', label: 'PlayStation', value: PlatformType.PLAYSTATION },
  { icon: 'fa-brands fa-xbox', label: 'Xbox', value: PlatformType.XBOX },
  { icon: 'fa-solid fa-n', label: 'Nintendo', value: PlatformType.NINTENDO },
  { icon: 'fa-brands fa-apple', label: 'Mac', value: PlatformType.MAC },
  { icon: 'fab fa-linux', label: 'Linux', value: PlatformType.LINUX },
  { icon: 'fa-brands fa-apple', label: 'iOS', value: PlatformType.IOS },
  { icon: 'fa-brands fa-android', label: 'Android', value: PlatformType.ANDROID },
];
