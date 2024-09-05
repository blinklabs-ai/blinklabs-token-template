import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import BigNumber from "bignumber.js";
import { useAccount, useBalance } from "wagmi";
import { CHAINS } from "@/constants/chains";
import config from "@/uiconfig.json";
import { zodResolver } from "@hookform/resolvers/zod";
import { SwapTokenSchema } from "@/lib/validations/token";

import SelectToken from "@/app/components/SwapWidget/SelectToken";
import AmountInput from "@/components/AmountInput";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/buttons/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

type FormData = z.infer<typeof SwapTokenSchema>;

const SwapWidget = () => {
  const TOKEN_LIST = ["ETH", "USDC", "USDT"];
  const { chainId, project } = config;
  const chain = CHAINS[chainId as keyof typeof CHAINS];
  const { address } = useAccount();
  const { data: balanceData, isSuccess } = useBalance({ address });

  const balance = isSuccess
    ? BigNumber(balanceData.value.toString(10))
        .div(1e18)
        .toFixed(6, BigNumber.ROUND_DOWN)
    : "0";

  const form = useForm<FormData>({ resolver: zodResolver(SwapTokenSchema) });

  const onSetHalfBalance = () =>
    form.setValue(
      "amount",
      balance === "0"
        ? "0"
        : BigNumber(balance).div(2).toFixed(6, BigNumber.ROUND_DOWN)
    );

  const onSetMaxBalance = () =>
    form.setValue("amount", balance === "0" ? "0" : balance);

  const onSubmit = async () => {
    // TODO: Implement swap logic
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="bg-neutral-700 rounded-lg p-3 font-medium">
          <div className="relative flex flex-col gap-3">
            <div className="bg-neutral-800 p-3 pb-6 rounded-lg">
              <p className="text-base text-neutral-400 mb-2">You Pay</p>

              <div className="flex items-center justify-between gap-4 mb-2">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AmountInput
                          className="bg-transparent text-xl text-neutral-500 p-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div>
                  <SelectToken tokenList={TOKEN_LIST} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">$0</span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="w-6 h-6 rounded-full bg-neutral-900"
                  >
                    <Icons.refreshCw
                      size={12}
                      strokeWidth={1}
                      color="#ffffff"
                    />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500 font-medium">
                    {balance} {chain.nativeCurrency.symbol}
                  </span>
                  <Button
                    className="text-neutral-200 text-xs rounded-full bg-neutral-700 hover:bg-neutral-600 h-6 px-2"
                    onClick={onSetHalfBalance}
                  >
                    50%
                  </Button>
                  <Button
                    className="text-neutral-200 text-xs rounded-full bg-neutral-700 hover:bg-neutral-600 h-6 px-2"
                    onClick={onSetMaxBalance}
                  >
                    Max
                  </Button>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full bg-primary shadow-sm hover:bg-primary hover:opacity-95"
              >
                <Icons.arrowDownUp size={20} strokeWidth={2} color="#000000" />
              </Button>
            </div>
            <div className="bg-neutral-800 p-3 pb-6 rounded-lg">
              <p className="text-base text-neutral-400 mb-4">You Receive</p>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-neutral-500 text-xl">0</span>
                <div>
                  <div className="rounded-full bg-neutral-700 py-1 px-2 h-7">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-white"></span>
                      <span className="text-sm text-white block">
                        {project.symbol}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">$0</span>
                <span className="text-neutral-500 font-medium">
                  30.234 USDC
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <Button className="font-bold px-10" variant={"default"}>
            View on Uniswap
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SwapWidget;
