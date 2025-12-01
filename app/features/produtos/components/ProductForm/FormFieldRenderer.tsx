import { useState } from "react";
import { Box, Slider, ToggleButton, ToggleButtonGroup, Typography, Paper } from "@mui/material";
import { Fields } from "~/src/components/utils/_fields";
import Upload from "~/src/components/utils/upload";
import type { FormField } from "./types";
import type { InternalUploadService } from "~/src/components/utils/upload/types";

interface FormFieldRendererProps {
  field: FormField;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  onBlur?: () => void;
}

export default function FormFieldRenderer({
  field,
  value,
  error,
  onChange,
  onBlur,
}: FormFieldRendererProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  if (field.customComponent) {
    const CustomComponent = field.customComponent;
    return (
      <CustomComponent
        field={field}
        value={value}
        error={error}
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  }

  switch (field.type) {
    case "text":
    case "email":
    case "tel":
      return renderTextInput(field, value, error, onChange, onBlur);

    case "number":
      return renderNumberInput(field, value, error, onChange, onBlur);

    case "checkbox":
      return renderCheckbox(field, value, error, onChange, onBlur);

    case "select":
      return renderSelect(field, value, error, onChange);

    case "textarea":
      return renderTextarea(field, value, error, onChange, onBlur);

    case "upload":
      return renderUpload(
        field,
        value,
        error,
        onChange,
        onBlur,
        uploadModalOpen,
        setUploadModalOpen
      );

    case "slider":
      return renderSlider(field, value, error, onChange);

    case "toggle":
      return renderToggle(field, value, error, onChange);

    case "category-cards":
      return renderCategoryCards(field, value, error, onChange);

    case "rich-text":
      return renderRichText(field, value, error, onChange, onBlur);

    default:
      return null;
  }
}

// Handlers específicos para cada tipo de campo
function handleTextInputChange(
  field: FormField,
  e: React.ChangeEvent<HTMLInputElement>,
  onChange: (value: unknown) => void
) {
  if (field.type === "checkbox") {
    onChange(e.target.checked);
  } else if (field.type === "number") {
    const numValue = e.target.value === "" ? undefined : parseFloat(e.target.value);
    onChange(numValue);
  } else {
    onChange(e.target.value);
  }
}

function handleSelectChange(
  e: React.ChangeEvent<HTMLSelectElement>,
  onChange: (value: unknown) => void
) {
  onChange(e.target.value);
}

function handleTextareaChange(
  e: React.ChangeEvent<HTMLTextAreaElement>,
  onChange: (value: unknown) => void
) {
  onChange(e.target.value);
}

// Renderizadores específicos para cada tipo de campo
function renderTextInput(
  field: FormField,
  value: unknown,
  error: string | undefined,
  onChange: (value: unknown) => void,
  onBlur?: () => void
) {
  return (
    <Fields.wrapper>
      <Fields.label text={field.label} required={field.required} hint={field.hint} />
      <Fields.input
        type={field.type}
        value={(value as string) || ""}
        onChange={(e) => handleTextInputChange(field, e, onChange)}
        onBlur={onBlur}
        placeholder={field.placeholder}
        required={field.required}
        disabled={field.disabled}
        error={error}
        name={field.name}
      />
    </Fields.wrapper>
  );
}

function renderNumberInput(
  field: FormField,
  value: unknown,
  error: string | undefined,
  onChange: (value: unknown) => void,
  onBlur?: () => void
) {
  return (
    <Fields.wrapper>
      <Fields.label text={field.label} required={field.required} hint={field.hint} />
      <Box sx={{ position: "relative" }}>
        {field.prefix && (
          <Typography
            sx={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "text.secondary",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            {field.prefix}
          </Typography>
        )}
        <Fields.input
          type="number"
          value={(value as number) || ""}
          onChange={(e) => handleTextInputChange(field, e, onChange)}
          onBlur={onBlur}
          placeholder={field.placeholder}
          required={field.required}
          disabled={field.disabled}
          error={error}
          name={field.name}
          min={field.validation?.min}
          max={field.validation?.max}
          style={{
            paddingLeft: field.prefix ? "40px" : undefined,
            paddingRight: field.suffix ? "60px" : undefined,
          }}
        />
        {field.suffix && (
          <Typography
            sx={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "text.secondary",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            {field.suffix}
          </Typography>
        )}
      </Box>
      {renderRequiredIndicator(field.required)}
    </Fields.wrapper>
  );
}

function renderCheckbox(
  field: FormField,
  value: unknown,
  error: string | undefined,
  onChange: (value: unknown) => void,
  onBlur?: () => void
) {
  return (
    <Fields.wrapper>
      <div className="flex items-center gap-2">
        <Fields.input
          type="checkbox"
          checked={(value as boolean) || false}
          onChange={(e) => handleTextInputChange(field, e, onChange)}
          onBlur={onBlur}
          disabled={field.disabled}
          name={field.name}
        />
        <Fields.label text={field.label} required={field.required} hint={field.hint} />
      </div>
    </Fields.wrapper>
  );
}

function renderSelect(
  field: FormField,
  value: unknown,
  error: string | undefined,
  onChange: (value: unknown) => void,
) {
  return (
    <Fields.wrapper>
      <Fields.label text={field.label} required={field.required} hint={field.hint} />
      <Fields.select
        value={(value as string) || ""}
        onChange={(e) => handleSelectChange(e, onChange)}
        options={field.options || []}
        required={field.required}
        disabled={field.disabled}
        hasError={!!error}
        error={
          error
            ? {
                error: true,
                message: error,
              }
            : { error: false, message: "" }
        }
        name={field.name}
      />
    </Fields.wrapper>
  );
}

function renderTextarea(
  field: FormField,
  value: unknown,
  error: string | undefined,
  onChange: (value: unknown) => void,
  onBlur?: () => void
) {
  return (
    <Fields.wrapper>
      <Fields.label text={field.label} required={field.required} hint={field.hint} />
      <textarea
        value={(value as string) || ""}
        onChange={(e) => handleTextareaChange(e, onChange)}
        onBlur={onBlur}
        placeholder={field.placeholder}
        required={field.required}
        disabled={field.disabled}
        className={`w-full px-3 py-2.5 border rounded text-sm bg-white text-[#1e1f21] transition-colors duration-200 outline-none min-h-[100px] resize-none ${
          error
            ? "border-beergam-red focus:border-beergam-red/90"
            : "border-black/20 focus:border-beergam-orange"
        } ${field.disabled ? "bg-gray-50 cursor-not-allowed border-gray-300 text-slate-500" : ""}`}
        name={field.name}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1 min-h-5 opacity-100">{error}</p>
      )}
    </Fields.wrapper>
  );
}

function renderUpload(
  field: FormField,
  value: unknown,
  error: string | undefined,
  onChange: (value: unknown) => void,
  _onBlur: (() => void) | undefined, // Parâmetro mantido para consistência da assinatura
  uploadModalOpen: boolean,
  setUploadModalOpen: (open: boolean) => void
) {
  if (!field.uploadConfig) {
    return null;
  }

  const uploadValue = Array.isArray(value) ? value : [];
  const uploadService = field.uploadConfig.service;
  const maxFiles = field.uploadConfig.maxFiles || 8;

  const handleUploadSuccess = (ids: string[]) => {
    onChange(ids);
    setUploadModalOpen(false);
  };

  return (
    <>
      <Fields.wrapper>
        <Fields.label text={field.label} required={field.required} hint={field.hint} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" },
            gap: 2,
            mt: 2,
          }}
        >
          <Box
            onClick={() => setUploadModalOpen(true)}
            sx={{
              aspectRatio: "1",
              bgcolor: "primary.main",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
                transform: "scale(1.02)",
              },
            }}
          >
            <Typography variant="h4" sx={{ mb: 1 }}>
              +
            </Typography>
            <Typography variant="caption" sx={{ textAlign: "center", px: 2, fontSize: "0.7rem" }}>
              Adicionar Novas fotos
            </Typography>
          </Box>

          {Array.from({ length: maxFiles - 1 }).map((_, index) => {
            const imageId = uploadValue[index];
            return (
              <Box
                key={index}
                sx={{
                  aspectRatio: "1",
                  bgcolor: imageId ? "grey.200" : "grey.50",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed",
                  borderColor: "grey.300",
                  color: "text.secondary",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {imageId ? (
                  <img
                    src={`/api/images/${imageId}`}
                    alt={`Imagem ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <>
                    <Typography variant="caption" sx={{ textAlign: "center", px: 2 }}>
                      Sem imagem
                    </Typography>
                    <Typography variant="caption" sx={{ textAlign: "center", px: 2, mt: 0.5, fontSize: "0.65rem" }}>
                      Arraste ou Insira aqui
                    </Typography>
                  </>
                )}
              </Box>
            );
          })}
        </Box>

        {uploadValue.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            {uploadValue.length} de {maxFiles} imagens adicionadas
          </Typography>
        )}
      </Fields.wrapper>

      {field.uploadConfig.typeImport === "internal" && (
        <Upload
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          typeImport="internal"
          service={uploadService as InternalUploadService}
          maxFiles={maxFiles}
          accept={field.uploadConfig.accept}
          emptyStateLabel={field.uploadConfig.emptyStateLabel}
          draggingLabel={field.uploadConfig.draggingLabel}
          onChange={handleUploadSuccess}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </>
  );
}

function renderSlider(
  field: FormField,
  value: unknown,
  error: string | undefined,
  onChange: (value: unknown) => void,
) {
  if (!field.sliderConfig) {
    return null;
  }

  const sliderValue = (value as number) || field.sliderConfig.min;

  return (
    <Fields.wrapper>
      <Fields.label text={field.label} required={field.required} hint={field.hint} />
      <Box sx={{ px: 2 }}>
        <Slider
          value={sliderValue}
          onChange={(_, newValue) => onChange(newValue)}
          min={field.sliderConfig.min}
          max={field.sliderConfig.max}
          step={field.sliderConfig.step || 1}
          disabled={field.disabled}
          valueLabelDisplay="auto"
          valueLabelFormat={(val) => `${val}${field.sliderConfig?.unit || ""}`}
          sx={{
            color: "primary.main",
            "& .MuiSlider-thumb": {
              "&:hover": {
                boxShadow: "0 0 0 8px rgba(255, 138, 0, 0.16)",
              },
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {field.sliderConfig.min}
            {field.sliderConfig.unit}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {field.sliderConfig.max}
            {field.sliderConfig.unit}
          </Typography>
        </Box>
      </Box>
      {renderRequiredIndicator(field.required)}
    </Fields.wrapper>
  );
}

function renderToggle(
  field: FormField,
  value: unknown,
  error: string | undefined,
  onChange: (value: unknown) => void,
) {
  if (!field.toggleOptions) {
    return null;
  }

  const toggleValue = (value as string) || field.toggleOptions.left;

  return (
    <Fields.wrapper>
      <Fields.label text={field.label} required={field.required} hint={field.hint} />
      <ToggleButtonGroup
        value={toggleValue}
        exclusive
        onChange={(_, newValue) => {
          if (newValue !== null) {
            onChange(newValue);
          }
        }}
        disabled={field.disabled}
        fullWidth
        sx={{
          "& .MuiToggleButton-root": {
            border: "1px solid",
            borderColor: "grey.300",
            "&.Mui-selected": {
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            },
          },
        }}
      >
        <ToggleButton value={field.toggleOptions.left}>
          {field.toggleOptions.left}
        </ToggleButton>
        <ToggleButton value={field.toggleOptions.right}>
          {field.toggleOptions.right}
        </ToggleButton>
      </ToggleButtonGroup>
    </Fields.wrapper>
  );
}

function renderCategoryCards(
  field: FormField,
  value: unknown,
  error: string | undefined,
  onChange: (value: unknown) => void,
) {
  if (!field.categoryOptions) {
    return null;
  }

  const selectedCategory = value as string | undefined;

  return (
    <Fields.wrapper>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Fields.label text={field.label} required={field.required} hint={field.hint} />
        <Typography variant="caption" color="text.secondary">
          Selecione a categoria do seu produto
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {field.categoryOptions.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <Paper
              key={category.id}
              elevation={isSelected ? 4 : 1}
              onClick={() => onChange(category.id)}
              sx={{
                p: 2,
                minWidth: 150,
                cursor: "pointer",
                border: isSelected ? 2 : 1,
                borderColor: isSelected ? "primary.main" : "grey.300",
                bgcolor: isSelected ? "primary.light" : "white",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                {category.icon}
                <Typography variant="body2" fontWeight={isSelected ? 600 : 400}>
                  {category.label}
                </Typography>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Fields.wrapper>
  );
}

function renderRichText(
  field: FormField,
  value: unknown,
  error: string | undefined,
  onChange: (value: unknown) => void,
  onBlur?: () => void
) {
  return (
    <Fields.wrapper>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Fields.label text={field.label} required={field.required} hint={field.hint} />
        <Typography variant="caption" color="primary.main" sx={{ bgcolor: "primary.light", px: 1, py: 0.5, borderRadius: 1 }}>
          IA Integrada
        </Typography>
      </Box>
      <Box
        sx={{
          border: "1px solid",
          borderColor: error ? "error.main" : "grey.300",
          borderRadius: 1,
          bgcolor: "white",
          minHeight: 200,
        }}
      >
        <Box sx={{ p: 1, borderBottom: "1px solid", borderColor: "grey.200", display: "flex", gap: 1 }}>
          <Typography variant="caption" sx={{ px: 1, py: 0.5, bgcolor: "grey.100", borderRadius: 1 }}>
            25
          </Typography>
          <Typography variant="caption" sx={{ px: 1, py: 0.5, bgcolor: "grey.100", borderRadius: 1, fontWeight: "bold" }}>
            B
          </Typography>
          <Typography variant="caption" sx={{ px: 1, py: 0.5, bgcolor: "grey.100", borderRadius: 1 }}>
            •
          </Typography>
        </Box>
        <textarea
          value={(value as string) || ""}
          onChange={(e) => handleTextareaChange(e, onChange)}
          onBlur={onBlur}
          placeholder={field.placeholder || "Escreva algo aqui"}
          required={field.required}
          disabled={field.disabled}
          style={{
            width: "100%",
            minHeight: 150,
            padding: 12,
            border: "none",
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </Box>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Fields.wrapper>
  );
}

// Componente auxiliar para indicador de campo obrigatório/opcional
function renderRequiredIndicator(required?: boolean) {
  if (required === undefined) {
    return null;
  }

  return (
    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
      {required ? "Obrigatório" : "Opcional"}
    </Typography>
  );
}

