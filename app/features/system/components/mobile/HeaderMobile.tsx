import Svg from "~/src/assets/svgs";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";

export default function HeaderMobile() {
    const { user } = useSelector((state: RootState) => state.auth);
    return (
        <>
        <div className="fixed top-0 left-0 right-0 z-1000 bg-beergam-blue-primary text-white border-b border-black/10 py-2 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Svg.profile tailWindClasses="size-5" />
                <span className="text-[18px] font-bold text-beergam-white">{user?.name}</span>
            </div>
            <div className="flex items-center justify-center gap-5">
                <button
                type="button"
                aria-label="Notificações"
                className="grid place-items-center">
                    <Svg.bell tailWindClasses="size-4.5" />
                </button>

                <button
                type="button"
                aria-label="Novidades"
                className="grid place-items-center">
                    <Svg.megaphone tailWindClasses="size-4.5" />
                </button>

                <button
                type="button"
                aria-label="Ajuda"
                className="grid place-items-center">
                    <Svg.question tailWindClasses="size-4.5" />
                </button>
                
            </div>
        </div>
        </>
    )
}