import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Svg from "~/src/assets/svgs";
import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import OverlayFrame from "~/features/system/shared/OverlayFrame";
import { useOverlay } from "~/features/system/hooks/useOverlay";
import { logout } from "~/features/auth/redux";
import { menuService } from "~/features/menu/service";
import { isMaster } from "~/features/user/utils";
import type { IUser } from "~/features/user/typings/User";

export default function PerfilHeaderMobile() {
  const { user } = useSelector((state: RootState) => state.user);
  const { isOpen, shouldRender, open, requestClose } = useOverlay();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await menuService.logout();
    if (res.success) {
      dispatch(logout());
      navigate("/login");
    } else {
      toast.error(res.message);
    }
  };

  const userEmail = user && isMaster(user as unknown as IUser) ? (user as unknown as IUser)?.details?.email : null;
  const userInitial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <OverlayFrame title="Usuário" isOpen={isOpen} shouldRender={shouldRender} onRequestClose={requestClose}>
        <div className="p-4">
          {user && (
            <div className="flex flex-col gap-4">
              {/* Informações do Usuário */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
                <div className="w-16 h-16 bg-beergam-blue-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-xl">{userInitial}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#323130] truncate mb-1" title={user?.name}>
                    {user?.name}
                  </p>
                  {userEmail && <p className="text-sm text-gray-600 truncate mb-2">{userEmail}</p>}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  aria-label="Sair da conta"
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-lg bg-beergam-red-light text-beergam-red-primary font-medium text-sm active:scale-[0.98] transition-transform"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </OverlayFrame>
      <div className="fixed top-0 left-0 right-0 z-1000 bg-beergam-blue-primary text-white border-b border-black/10 py-2 px-4 flex items-center">
        <button type="button" aria-label="Perfil" className="flex items-center gap-2" onClick={open}>
          <Svg.profile tailWindClasses="size-5" />
          <span className="text-[18px] font-bold text-beergam-white">{user?.name}</span>
        </button>
      </div>
    </>
  );
}

