import HeaderDesktop from "./desktop/HeaderDesktop";
import BottomNav from "~/features/system/components/mobile/BottomNav";
import HeaderMobile from "./mobile/HeaderMobile";

export default function SystemHeader() {
    return (
      <>
      <HeaderMobile />
      <HeaderDesktop />
      <BottomNav />
      </>
    );
}