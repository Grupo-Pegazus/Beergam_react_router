import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { ProductDetails } from "../../../typings";

interface ProductRelatedAdsProps {
  product: ProductDetails;
}

export default function ProductRelatedAds({ product }: ProductRelatedAdsProps) {
  const hasRelatedAds = product.related_ads && product.related_ads.length > 0;

  if (!hasRelatedAds) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: "1px solid rgba(15, 23, 42, 0.08)",
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Anúncios Relacionados
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Marketplace</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>ID da Loja</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>ID do Anúncio</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>ID da Variação</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.related_ads.map((ad, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip
                      label={ad.marketplace.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: "#dbeafe",
                        color: "#1e40af",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                      {ad.marketplace_shop_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                      {ad.ad_external_id || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                      {ad.ad_variation_external_id || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                      {ad.sku}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
}

