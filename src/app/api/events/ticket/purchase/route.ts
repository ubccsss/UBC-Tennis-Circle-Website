import { stripe, connectToDatabase } from "@lib";
import axios, { AxiosResponse } from "axios";
import { NextRequest } from "next/server";
import z from "zod";
import { getSession, ServerResponse } from "@helpers";
import { TennisEvent } from "@types";

const purchaseSchema = z.object({
  event_id: z.string({ required_error: "Event token is required" }),
});

export const POST = async (request: NextRequest) => {
  await connectToDatabase();

  const { event_id } = await request.json();

  const validation = purchaseSchema.safeParse({ event_id });

  const { session } = await getSession(request);

  const url = new URL(request.url);

  const pathname = url.pathname;

  if (!session) {
    return ServerResponse.success({
      url: `${process.env.NEXT_PUBLIC_HOSTNAME}/login?redirect=${pathname}`,
    });
  }

  if (validation.success) {
    try {
      const event: AxiosResponse<TennisEvent> = await axios.post(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/events/detail`,
        {
          id: event_id,
        },
      );

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              unit_amount: event.data.ticket_price * 100,
              currency: "cad",
              product_data: {
                name: `${event.data.name} Ticket`,
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          event_id,
        },
        //TODO: MAKE THESE ROUTES
        success_url: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/ticket/purchase/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_HOSTNAME}/events/detail/${event_id}`,
        automatic_tax: { enabled: true },
      });

      return ServerResponse.success({ url: session.url });
    } catch (e) {
      console.log(e);
      return ServerResponse.serverError();
    }
  }
};
