import { Skeleton } from "@mui/material";
import styles from "../../page.module.css";

export default function VendaDetailsSkeleton() {
  return (
    <div style={{ padding: "20px", margin: "0 auto", width: "100%" }}>
      {/* Header Skeleton */}
      <div style={{ marginBottom: "24px" }}>
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Skeleton variant="text" width={200} height={20} />
          <Skeleton variant="text" width={20} height={20} />
          <Skeleton variant="rectangular" width={100} height={24} sx={{ borderRadius: "12px" }} />
        </div>
      </div>

      {/* Main Layout - Two Columns */}
      <div className={styles.orderDetailsLayout}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* ClienteCard Skeleton */}
          <div
            style={{
              background: "var(--white)",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <Skeleton variant="circular" width={60} height={60} />
              <div style={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="50%" height={20} />
              </div>
            </div>
            <Skeleton variant="text" width={150} height={20} />
          </div>

          {/* ResumoEnvio Skeleton */}
          <div
            style={{
              background: "var(--white)",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <Skeleton variant="text" width={120} height={16} />
              <Skeleton variant="text" width={180} height={20} />
            </div>
          </div>

          {/* Timeline Skeleton */}
          <div
            style={{
              background: "var(--white)",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                <Skeleton variant="circular" width={24} height={24} />
                <div style={{ flex: 1 }}>
                  <Skeleton variant="text" width="50%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="70%" height={16} />
                </div>
              </div>
            ))}
          </div>

          {/* OrderItemCard Skeletons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1, 2].map((i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  padding: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                  <Skeleton variant="rectangular" width={64} height={64} sx={{ borderRadius: "8px" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={16} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    background: "#ffffff",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} variant="rectangular" width="25%" height={50} sx={{ borderRadius: "8px" }} />
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    background: "#ffffff",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <Skeleton variant="rectangular" width="50%" height={50} sx={{ borderRadius: "8px" }} />
                  <Skeleton variant="rectangular" width="50%" height={50} sx={{ borderRadius: "8px" }} />
                </div>
              </div>
            ))}
          </div>

          {/* DetalhesEnvio Skeletons */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            {[1, 2].map((i) => (
              <div
                key={i}
                style={{
                  background: "var(--white)",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <Skeleton variant="text" width={80} height={16} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="100%" height={20} />
                  </div>
                  <div>
                    <Skeleton variant="text" width={80} height={16} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="100%" height={20} />
                  </div>
                  <div>
                    <Skeleton variant="text" width={80} height={16} sx={{ mb: 0.5 }} />
                    <Skeleton variant="text" width="100%" height={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "sticky", top: "20px" }}>
          {/* AnaliseFinanceira Skeleton */}
          <div
            style={{
              background: "var(--white)",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Skeleton variant="text" width="60%" height={28} sx={{ mb: 3 }} />

            {/* Receita Section */}
            <div style={{ marginBottom: "24px" }}>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={20} />
                    {i === 1 && <Skeleton variant="text" width="50%" height={14} sx={{ mt: 0.5 }} />}
                  </div>
                  <Skeleton variant="text" width={100} height={20} />
                </div>
              ))}
            </div>

            {/* Custos Internos Section */}
            <div style={{ marginBottom: "24px" }}>
              <Skeleton variant="text" width="50%" height={24} sx={{ mb: 2 }} />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={14} sx={{ mt: 0.5 }} />
                  </div>
                  <Skeleton variant="text" width={100} height={20} />
                </div>
              ))}
            </div>

            {/* Lucro Final */}
            <div
              style={{
                padding: "16px",
                background: "#f8f9fa",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width={120} height={28} />
              </div>
            </div>

            {/* Action Button */}
            <Skeleton variant="rectangular" width="100%" height={44} sx={{ borderRadius: "8px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

