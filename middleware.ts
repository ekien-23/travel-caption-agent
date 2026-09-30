import { paymentMiddleware } from "x402-next";

export const middleware = paymentMiddleware(
  process.env.CDP_WALLET_ADDRESS as `0x${string}`,
  {
    "/api/caption": {
      price: "$0.01",
      network: "base",
      config: {
        description: "AI Travel Caption - $0.01"
      }
    }
  }
);

export const config = {
  matcher: ["/api/caption"],
};
