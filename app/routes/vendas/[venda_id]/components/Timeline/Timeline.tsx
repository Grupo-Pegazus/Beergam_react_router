import { useMemo } from "react";

interface TimelineItem {
    title: string;
    date: string;
    description: string;
    location?: string;
}

interface GroupedTimelineItem {
    title: string;
    items: TimelineItem[];
}

interface TimelineProps {
    items: TimelineItem[];
}

function Timeline({items}: TimelineProps) {
    const mostrarDetalhes = true;

    // Agrupar itens por título
    const groupedItems = useMemo(() => {
        const groups: GroupedTimelineItem[] = [];
        const titleMap = new Map<string, TimelineItem[]>();

        items.forEach(item => {
            if (!titleMap.has(item.title)) {
                titleMap.set(item.title, []);
            }
            titleMap.get(item.title)!.push(item);
        });

        titleMap.forEach((groupItems, title) => {
            groups.push({
                title,
                items: groupItems
            });
        });

        return groups;
    }, [items]);

    return (
        <div className="flex flex-col self-start text-left">
            <div className="relative pl-10 flex flex-col justify-between">
                <div className="absolute left-[15px] top-0 bottom-0 w-[3px] bg-beergam-primary z-0 -translate-x-[1.5px]" />
                {groupedItems.map((group, groupIndex) => (
                    <div key={groupIndex} className="relative">
                        <div className="w-[30px] h-[30px] rounded-full bg-beergam-primary border-2 border-beergam-typography-secondary! box-content absolute -left-10 top-0 z-[1]" />
                        <div className="m-4">
                            <strong className="text-base text-beergam-primary!">{group.title}</strong>
                            <div
                                className={`max-h-[500px] opacity-100 translate-y-0 overflow-hidden transition-all duration-[400ms] ease-in-out ${
                                    mostrarDetalhes 
                                        ? "opacity-100 translate-y-0" 
                                        : "max-h-0 opacity-0 -translate-y-[10px]"
                                }`}>
                                {group.items.map((item, itemIndex) => (
                                    <div 
                                        key={itemIndex} 
                                        className={`text-beergam-typography-tertiary! text-sm mt-1 mb-1 ${
                                            itemIndex !== group.items.length - 1 ? "mb-2" : ""
                                        }`}>
                                        {item.date} | {item.description}
                                        {item.location && <span className="text-beergam-typography-secondary! italic"> | {item.location}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* <BeergamButton
              title={mostrarDetalhes ? "Esconder detalhes" : "Mostrar detalhes"}
              mainColor="beergam-gray"
              animationStyle="fade"
              onClick={clickDetalhes}
              className="w-fit p-2 bg-transparent text-blue cursor-pointer text-base transition-all duration-300 ease-in-out my-4 rounded-[10px] outline-none hover:text-white hover:bg-blue"
            /> */}
        </div>
    );
};

export default Timeline;
