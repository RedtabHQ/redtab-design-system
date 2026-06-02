import { DEFAULT_GLOBAL_CURRENCY, DEFAULT_GLOBAL_CURRENCY_SYMBOL } from "@/constants/currency";
import { useExchangeRate } from "@/contexts";
import { useCurrencyByCode } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils";


export interface AmountProps {
    value: number;
    currency?: string;
    symbol?: string;
    pretty?: boolean;

    showUSD?: boolean;
    mainClassName?: string;
    subClassName?: string;
}

const toUsd = (amt: number, rate: number) => amt / rate;

export const Amount = ({ value, currency, showUSD, mainClassName, subClassName, pretty }: AmountProps) => {
    const data = useCurrencyByCode(currency);
    const formattedAmount = currency ? formatCurrency(value, currency, data.data?.symbol, pretty) : value;

    return (
        <>
            <p className={cn("text-sm font-black text-gray-900 break-words", mainClassName)}>
                {formattedAmount}
            </p>

            {data.data?.exchangeRate && currency && showUSD && currency != "USD" && (
                <p className={cn("text-xs text-gray-400 font-medium mt-0.5 break-words", subClassName)}>
                    {formatCurrency(toUsd(value, data.data?.exchangeRate || 1) || 0, DEFAULT_GLOBAL_CURRENCY, DEFAULT_GLOBAL_CURRENCY_SYMBOL, pretty)}
                </p>
            )}
        </>
    );
};

