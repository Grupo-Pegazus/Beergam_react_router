import { useSelector } from "react-redux";
import type { RootState } from "~/store";
import { MarketplaceType, MarketplaceTypeLabel } from "~/features/marketplace/typings";
import { useNavigate } from "react-router";

export default function AccountView({ expanded = false }: { expanded?: boolean }) {
    const marketplace = useSelector((state: RootState) => state.marketplace.marketplace);
    const navigate = useNavigate();

    const AvatarButton = (
        <button
            type="button"
            onClick={() => navigate("interno/choosen_account")}
            className="relative w-[50px] h-[50px] min-w-[50px] min-h-[50px] rounded-full overflow-hidden group flex-none transition-transform duration-200 ease-in-out"
            title="Trocar de conta"
            aria-label="Trocar de conta de marketplace"
            style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer" }}
        >
            <img
                src={marketplace?.marketplace_image}
                alt={marketplace?.marketplace_name}
                className="w-full h-full rounded-full object-cover transition-opacity duration-200 ease-in-out group-hover:opacity-70"
            />
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out bg-black/30">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="white"
                    className="w-5 h-5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                </svg>
            </span>
        </button>
    );

    if (!expanded) {
        return (
            <div className="flex items-center gap-2">
                {AvatarButton}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {AvatarButton}
            <div className="flex flex-col min-w-0 transition-opacity duration-200 ease-in-out">
                <p
                    className="font-semibold leading-4 truncate"
                    title={marketplace?.marketplace_name}
                >
                    {marketplace?.marketplace_name}
                </p>
                <p className="text-xs opacity-60 leading-4">
                    {MarketplaceTypeLabel[marketplace?.marketplace_type as MarketplaceType]}
                </p>
            </div>
        </div>
    );
}