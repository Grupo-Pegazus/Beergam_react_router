import { useEffect, useRef, useState, lazy, Suspense, useCallback } from "react";
import OverlayFrame from "../../shared/OverlayFrame";
import { useOverlay } from "../../hooks/useOverlay";
import { useMarketplaceAccounts } from "~/features/marketplace/hooks/useMarketplaceAccounts";
import Modal from "~/src/components/utils/Modal";
import { MarketplaceTypeLabel } from "~/features/marketplace/typings";

const CreateMarketplaceModal = lazy(() => import("~/routes/choosen_account/components/CreateMarketplaceModal"));

export default function MobileAccountOverlay({ onClose }: { onClose: () => void }) {
  const first = useRef<HTMLButtonElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { isOpen, shouldRender, open, requestClose } = useOverlay();
  useEffect(() => {
    open();
  }, [open]);

  const handleClose = useCallback(() => {
    requestClose(onClose);
  }, [requestClose, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    first.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); };
  }, [handleClose]);

  return (
    <OverlayFrame title="Trocar de conta" isOpen={isOpen} shouldRender={shouldRender} onRequestClose={handleClose}>
      <AccountList onAdd={() => setModalOpen(true)} onSelected={handleClose} />
        <Modal abrir={modalOpen} onClose={() => setModalOpen(false)}>
          <Suspense fallback={<div className="flex items-center justify-center min-h-[200px]"><div className="animate-spin rounded-full h-8 w-8 border-2 border-beergam-orange border-t-transparent"></div></div>}>
            <CreateMarketplaceModal marketplacesAccounts={[]} modalOpen={modalOpen} />
          </Suspense>
        </Modal>
    </OverlayFrame>
  );
}

function AccountList({ onSelected, onAdd }: { onSelected: () => void; onAdd: () => void }) {
  const { accounts, current, isLoading, selectAccountAsync, isSelecting } = useMarketplaceAccounts();
  return (
    <div className="p-4 overflow-y-auto">
      {isLoading ? (
        <div className="text-sm opacity-70">Carregando contas...</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {accounts.map((acc) => (
            <button
              key={acc.marketplace_shop_id}
              type="button"
              onClick={async () => { await selectAccountAsync(acc); onSelected(); }}
              disabled={isSelecting}
              className={[
                "w-full flex items-center gap-3 p-3 rounded-xl border border-black/10 bg-white shadow-sm",
                acc.marketplace_shop_id === current?.marketplace_shop_id ? "ring-2 ring-beergam-orange" : "",
              ].join(" ")}
            >
              <img src={acc.marketplace_image} alt={acc.marketplace_name} className="w-10 h-10 rounded-full object-cover" />
              <div className="text-left min-w-0">
                <div className="font-medium truncate">{acc.marketplace_name}</div>
                <div className="text-xs opacity-70 truncate">{MarketplaceTypeLabel[acc.marketplace_type]}</div>
              </div>
            </button>
          ))}
          <button
            type="button"
            onClick={onAdd}
            className="mt-2 px-3 py-2 rounded-xl border border-black/10 bg-[#f6f8fb] text-center"
          >
            Adicionar conta
          </button>
        </div>
      )}
    </div>
  );
}


