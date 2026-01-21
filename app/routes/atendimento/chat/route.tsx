import type { Route } from ".react-router/types/app/routes/atendimento/chat/+types/route";
import ChatPage from "./page";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Beergam | Chat" },
        { name: "description", content: "Chat de atendimento" },
    ];
}

export default function Chat() {
    return <ChatPage />;
}
