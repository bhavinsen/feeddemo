export interface CurrencyCardProps {
    title: string;
    data: {
        price: string;
        best_ask: string;
        best_ask_size: string;
        best_bid: string;
        high_24h: string;
        last_size: string;
        low_24h: string;
        open_24h: string;
        best_bid_size: string;
        side: string;
        product_id: string;
        time: string;
        size: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    handleUnSubscribe: Function;
}