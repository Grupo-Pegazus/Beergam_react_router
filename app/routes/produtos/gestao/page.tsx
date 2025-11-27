import Grid from "~/src/components/ui/Grid";
import Section from "~/src/components/ui/Section";

export default function ProdutosPage() {
    return (
        <>
            <Section title="Gerenciamento de Produtos">
                <Grid cols={{ base: 1, lg: 1 }}>
                    <p>Produtos</p>
                </Grid>
            </Section>
        </>
    )
}