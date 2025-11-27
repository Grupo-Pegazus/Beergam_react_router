import { CDN_IMAGES } from "~/src/constants/cdn-images";
import UserPhoto from "../UserPhoto";
export default function ConfigHeader() {
  return (
    <header className="fixed flex justify-between items-center top-0 left-0 p-4 right-0 z-1000 ">
      <img
        src={CDN_IMAGES.BERGAMOTA_LOGO}
        alt="Beergam Logo"
        className="w-10 h-10 object-contain"
      />
      <UserPhoto />
    </header>
  );
}
