import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  useForm,
  type Path,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { authService } from "~/features/auth/service";
import UserFields from "~/features/user/components/UserFields";
import { ComoConheceu, ProfitRange } from "~/features/user/typings/User";
import { Fields } from "~/src/components/utils/_fields";
import BeergamButton from "~/src/components/utils/BeergamButton";
import {
  BeergamTurnstile,
  type BeergamTurnstileRef,
} from "~/src/components/utils/BeergamTurnstile";
import { CDN_IMAGES } from "~/src/constants/cdn-images";
import { RegistroFormSchema } from "../../typings";
type RegistroFormValues = z.infer<typeof RegistroFormSchema>;

export default function RegistroForm() {
  const navigate = useNavigate();
  const resolver: Resolver<RegistroFormValues> = zodResolver(
    RegistroFormSchema
  ) as unknown as Resolver<RegistroFormValues>;

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<RegistroFormValues>({
    resolver,
    defaultValues: {
      document_type: "CPF",
    },
    reValidateMode: "onChange",
  });

  const [selectedDocument, setSelectedDocument] = useState<"CPF" | "CNPJ">(
    "CPF"
  );

  const currentDocumentType = watch("document_type") || selectedDocument;

  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<BeergamTurnstileRef>(null);
  const registerMutation = useMutation({
    mutationFn: ({
      user,
      turnstileToken,
    }: {
      user: RegistroFormValues;
      turnstileToken: string;
    }) => authService.register(user, turnstileToken),
    onSuccess: (data) => {
      if (!data.success) {
        turnstileRef.current?.reset();
        setTurnstileToken("");
        if (!Array.isArray(data.error_fields)) {
          throw new Error(data.message);
        }
        data.error_fields?.forEach((error) => {
          setError(`${error.key}` as Path<RegistroFormValues>, {
            type: "server",
            message: error.error,
          });
        });
        const errorMessage = `${data.error_fields?.map((error) => `${error.error}`).join("\n")}`;
        throw new Error(errorMessage);
      } else {
        navigate("/login", { viewTransition: true });
      }
    },
  });

  const onSubmit: SubmitHandler<RegistroFormValues> = (data) => {
    const token = turnstileRef.current?.getToken() || turnstileToken;
    if (!token) {
      throw new Error("Por favor, complete a verificação de segurança.");
    }
    const user_data = {
      name: data.name,
      password: data.password,
      details: {
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        cnpj: data.cnpj,
        referral_code: data.referral_code,
        found_beergam: data.found_beergam,
        profit_range: data.profit_range,
      },
    };
    const request = registerMutation.mutateAsync({
      user: user_data,
      turnstileToken: token,
    });
    toast.promise(request, {
      loading: "Cadastrando...",
      success: "Cadastro realizado com sucesso",
      error: (err) => {
        if (err instanceof Error) {
          return err.message;
        }
        return "Erro ao cadastrar";
      },
    });
  };
  useEffect(() => {
    if (selectedDocument === "CNPJ") {
      setValue("cnpj", null);
      setValue("cpf", undefined);
    } else {
      setValue("cnpj", null);
      setValue("cpf", undefined);
    }
  }, [selectedDocument]);
  return (
    <section className="h-full overflow-y-auto overflow-x-hidden shadow-lg/55 bg-beergam-white p-8 rounded-tl-none rounded-tr-none rounded-xl gap-4 flex flex-col lg:rounded-tl-2xl lg:rounded-br-none">
      <div className="flex md:flex-row flex-col md:items-center gap-2">
        <Link to="/" className="w-10 h-10 cursor-pointer hover:opacity-80">
          <img
            src={CDN_IMAGES.BERGAMOTA_LOGO}
            alt="Beergam"
            className="w-full h-full object-contain"
          />
        </Link>
        <h1 className="text-beergam-blue-primary">Cadastre-se</h1>
      </div>
      <UserFields
        label="E-mail"
        placeholder="Digite seu endereço de E-mail"
        {...register("email")}
        type="email"
        error={errors.email?.message}
        canAlter={true}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserFields
          label="Nome Completo ou Razão Social"
          placeholder="Digite seu nome completo ou razão social"
          {...register("name")}
          error={errors.name?.message}
          canAlter={true}
        />
        <div className="flex items-end gap-4">
          <UserFields
            label="Documento"
            placeholder={`Digite seu ${currentDocumentType === "CPF" ? "CPF" : "CNPJ"}`}
            error={
              errors[currentDocumentType === "CPF" ? "cpf" : "cnpj"]?.message
            }
            canAlter={true}
            {...register(currentDocumentType === "CPF" ? "cpf" : "cnpj")}
          />
          <Fields.select
            options={[
              { value: "CPF", label: "CPF" },
              { value: "CNPJ", label: "CNPJ" },
            ]}
            value={currentDocumentType}
            onChange={(e) => {
              const value = e.target.value as "CPF" | "CNPJ";
              setSelectedDocument(value);
              setValue("document_type", value, { shouldValidate: true });
            }}
          />
        </div>
        <UserFields
          label="Senha"
          placeholder="Digite sua senha"
          {...register("password")}
          type="password"
          canAlter={true}
          error={errors.password?.message}
        />
        <UserFields
          label="Confirmar Senha"
          placeholder="Digite sua senha novamente"
          {...register("password_confirmation")}
          type="password"
          canAlter={true}
          error={errors.password_confirmation?.message}
        />
        <UserFields
          label="Telefone"
          placeholder="Digite seu telefone"
          {...register("phone")}
          type="tel"
          canAlter={true}
          error={errors.phone?.message}
        />
        <UserFields
          label="Código de Indicação"
          placeholder="Digite seu código de indicação"
          {...register("referral_code")}
          type="text"
          canAlter={true}
          error={errors.referral_code?.message}
        />
        <UserFields
          label="Como Conheceu o Beergam?"
          placeholder="Digite como você conheceu o Beergam"
          value={watch("found_beergam")}
          name="found_beergam"
          type="select"
          options={Object.keys(ComoConheceu).map((key) => ({
            value: key,
            label: ComoConheceu[key as keyof typeof ComoConheceu],
          }))}
          onChange={(e) => {
            setValue("found_beergam", e.target.value as ComoConheceu, {
              shouldValidate: true,
              shouldTouch: true,
            });
          }}
          canAlter={true}
          error={errors.found_beergam?.message}
        />
        <UserFields
          name="profit_range"
          label="Faturamento Mensal"
          placeholder="Digite seu faturamento mensal"
          value={watch("profit_range")}
          error={errors.profit_range?.message}
          type="select"
          options={Object.keys(ProfitRange).map((key) => ({
            value: key,
            label: ProfitRange[key as keyof typeof ProfitRange],
          }))}
          onChange={(e) => {
            setValue("profit_range", e.target.value as ProfitRange, {
              shouldValidate: true,
              shouldTouch: true,
            });
          }}
          canAlter={true}
        />
      </div>
      <BeergamTurnstile
        ref={turnstileRef}
        onTokenChange={setTurnstileToken}
        onError={() => {
          setTurnstileToken("");
        }}
      />
      <input type="hidden" name="turnstile_token" value={turnstileToken} />
      <BeergamButton
        title="Cadastrar"
        mainColor="beergam-orange"
        animationStyle="slider"
        type="submit"
        className="w-full rounded-2xl"
        onClick={handleSubmit(onSubmit, (errors) => {
          toast.error("Você possui erros pendentes no formulário.");
          console.log("Erros de validação:", errors);
        })}
      />
      <p className="text-beergam-gray font-medium">
        Ao começar o teste gratuito, declaro que li e aceito os{" "}
        <Link
          className="text-beergam-blue-primary hover:text-beergam-orange underline"
          to="/termos-de-servico"
          target="_blank"
        >
          termos e condições de uso
        </Link>{" "}
        do sistema.
      </p>
      <p className="text-beergam-gray font-medium">
        Já possui uma conta?{" "}
        <Link
          className="text-beergam-blue-primary hover:text-beergam-orange underline"
          to="/login"
        >
          Acessar
        </Link>
      </p>
    </section>
  );
}
