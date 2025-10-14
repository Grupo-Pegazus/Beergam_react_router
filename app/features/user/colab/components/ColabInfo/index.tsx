import { ColabLevel, type IColab } from "~/features/user/typings/Colab";
import { Fields } from "~/src/components/utils/_fields";
export default function ColabInfo(colab: IColab) {
  // const IOSSwitch = styled((props: SwitchProps) => (
  //   <Switch
  //     focusVisibleClassName=".Mui-focusVisible"
  //     disableRipple
  //     {...props}
  //   />
  // ))(({ theme }) => ({
  //   width: 42,
  //   height: 26,
  //   padding: 0,
  //   "& .MuiSwitch-switchBase": {
  //     padding: 0,
  //     margin: 2,
  //     transitionDuration: "300ms",
  //     "&.Mui-checked": {
  //       transform: "translateX(16px)",
  //       color: "#fff",
  //       "& + .MuiSwitch-track": {
  //         backgroundColor: "#65C466",
  //         opacity: 1,
  //         border: 0,
  //         ...theme.applyStyles("dark", {
  //           backgroundColor: "#2ECA45",
  //         }),
  //       },
  //       "&.Mui-disabled + .MuiSwitch-track": {
  //         opacity: 0.5,
  //       },
  //     },
  //     "&.Mui-focusVisible .MuiSwitch-thumb": {
  //       color: "#33cf4d",
  //       border: "6px solid #fff",
  //     },
  //     "&.Mui-disabled .MuiSwitch-thumb": {
  //       color: theme.palette.grey[100],
  //       ...theme.applyStyles("dark", {
  //         color: theme.palette.grey[600],
  //       }),
  //     },
  //     "&.Mui-disabled + .MuiSwitch-track": {
  //       opacity: 0.7,
  //       ...theme.applyStyles("dark", {
  //         opacity: 0.3,
  //       }),
  //     },
  //   },
  //   "& .MuiSwitch-thumb": {
  //     boxSizing: "border-box",
  //     width: 22,
  //     height: 22,
  //   },
  //   "& .MuiSwitch-track": {
  //     borderRadius: 26 / 2,
  //     backgroundColor: "#E9E9EA",
  //     opacity: 1,
  //     transition: theme.transitions.create(["background-color"], {
  //       duration: 500,
  //     }),
  //     ...theme.applyStyles("dark", {
  //       backgroundColor: "#39393D",
  //     }),
  //   },
  // }));
  return (
    <div className="grid grid-cols-2 grid-rows-1 gap-4">
      {/* <h2>Editar Colaborador</h2>
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-1">
          <div className="min-w-32 min-h-32 rounded-full object-cover object-center bg-beergam-orange"></div>
          <FormControlLabel
            control={
              <IOSSwitch
                sx={{ m: 1 }}
                onChange={() => {
                  isColabEnabled = !isColabEnabled;
                }}
                defaultChecked={isColabEnabled}
              />
            }
            label=""
          />
        </div>
        <div className="flex flex-col gap-1">
          <Fields.wrapper>
            <Fields.label text="NOME" />
            <Fields.input value={colab.name} />
          </Fields.wrapper>
          <Fields.wrapper>
            <Fields.label text="Senha de acesso" />
            <Fields.input value={"asdaokdokas"} type="password" />
          </Fields.wrapper>
          <Fields.wrapper>
            <Fields.label text="Confirmar Senha de acesso" />
            <Fields.input value={"asdaokdokas"} type="password" />
          </Fields.wrapper>
        </div>
      </div>
      <p>Tipo: {colab.details.level}</p> */}
      <div className="flex flex-col justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="min-w-32 min-h-32 rounded-full object-cover object-center bg-beergam-orange"></div>
          <div className="grid grid-cols-2 gap-2">
            <Fields.wrapper>
              <Fields.label text="NOME" />
              <Fields.input value={colab.name} />
            </Fields.wrapper>
            <Fields.wrapper>
              <Fields.label text="SENHA DE ACESSO" />
              <Fields.input value={"asdaokdokas"} type="password" />
            </Fields.wrapper>
            {Object.keys(ColabLevel).map((level) => (
              <button
                key={level}
                className={`text-white px-4 py-2 rounded-md ${
                  colab.details.level === level
                    ? "bg-beergam-orange"
                    : "bg-beergam-blue-primary"
                }`}
              >
                <p>{ColabLevel[level as unknown as keyof typeof ColabLevel]}</p>
              </button>
            ))}
          </div>
        </div>
        <button>Salvar</button>
      </div>
    </div>
  );
}
