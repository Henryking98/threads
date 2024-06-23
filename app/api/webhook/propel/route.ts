/* eslint-disable camelcase */

// Resource: https://docs.svix.com/receiving/verifying-payloads/why
// It's a good practice to verify webhooks. Above article shows why we should do it

import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { IncomingHttpHeaders } from "http";
import { NextResponse } from "next/server";
import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} from "@/lib/actions/community.actions";

// Define the events type from Propelauth
type EventType =
  | "org.created"
  | "org.deleted"
  | "user.added_to_org"
  | "user.removed_from_org"
  | "org.updated"
  | "user.invited_to_org";

type Event = {
  data: Record<string, any>;
  object: "event";
  type: EventType;
};

export const POST = async (request: Request) => {
  const payload = await request.json();
  const header = headers();

  const heads = {
    "svix-id": header.get("svix-id"),
    "svix-timestamp": header.get("svix-timestamp"),
    "svix-signature": header.get("svix-signature"),
  };

  const wh = new Webhook(process.env.NEXT_PROPELAUTH_WEBHOOK_SECRET || "");

  let evnt: Event | null = null;

  try {
    evnt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }

  const eventType: EventType = evnt?.type!;

  switch (eventType) {
    case "org.created":
      try {
        const { id, name, slug, logo_url, image_url, created_by } = evnt.data;
        await createCommunity(
          id,
          name,
          slug,
          logo_url || image_url,
          "org bio",
          created_by
        );
        return NextResponse.json(
          { message: "Organization created" },
          { status: 201 }
        );
      } catch (err) {
        console.log(err);
        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }

    case "user.invited_to_org":
      try {
        console.log("Invitation created", evnt.data);
        return NextResponse.json(
          { message: "Invitation created" },
          { status: 201 }
        );
      } catch (err) {
        console.log(err);
        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }

    case "user.added_to_org":
      try {
        const { organization, public_user_data } = evnt.data;
        console.log("Membership created", evnt.data);
        await addMemberToCommunity(organization.id, public_user_data.user_id);
        return NextResponse.json({ message: "Member added" }, { status: 201 });
      } catch (err) {
        console.log(err);
        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }

    case "user.removed_from_org":
      try {
        const { organization, public_user_data } = evnt.data;
        console.log("Membership deleted", evnt.data);
        await removeUserFromCommunity(
          public_user_data.user_id,
          organization.id
        );
        return NextResponse.json(
          { message: "Member removed" },
          { status: 201 }
        );
      } catch (err) {
        console.log(err);
        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }

    case "org.updated":
      try {
        const { id, logo_url, name, slug } = evnt.data;
        console.log("Organization updated", evnt.data);
        await updateCommunityInfo(id, name, slug, logo_url);
        return NextResponse.json(
          { message: "Organization updated" },
          { status: 201 }
        );
      } catch (err) {
        console.log(err);
        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }

    case "org.deleted":
      try {
        const { id } = evnt.data;
        console.log("Organization deleted", evnt.data);
        await deleteCommunity(id);
        return NextResponse.json(
          { message: "Organization deleted" },
          { status: 201 }
        );
      } catch (err) {
        console.log(err);
        return NextResponse.json(
          { message: "Internal Server Error" },
          { status: 500 }
        );
      }

    default:
      return NextResponse.json(
        { message: "Unhandled event type" },
        { status: 400 }
      );
  }
};
// /* eslint-disable camelcase */
// // Resource: https://clerk.com/docs/users/sync-data-to-your-backend
// // Above article shows why we need webhooks i.e., to sync data to our backend

// // Resource: https://docs.svix.com/receiving/verifying-payloads/why
// // It's a good practice to verify webhooks. Above article shows why we should do it
// import { Webhook, WebhookRequiredHeaders } from "svix";
// import { headers } from "next/headers";

// import { IncomingHttpHeaders } from "http";

// import { NextResponse } from "next/server";
// import {
//   addMemberToCommunity,
//   createCommunity,
//   deleteCommunity,
//   removeUserFromCommunity,
//   updateCommunityInfo,
// } from "@/lib/actions/community.actions";

// // Resource: https://clerk.com/docs/integration/webhooks#supported-events
// // Above document lists the supported events
// type EventType =
//   | "organization.created"
//   | "organizationInvitation.created"
//   | "organizationMembership.created"
//   | "organizationMembership.deleted"
//   | "organization.updated"
//   | "organization.deleted";

// type Event = {
//   data: Record<string, string | number | Record<string, string>[]>;
//   object: "event";
//   type: EventType;
// };

// export const POST = async (request: Request) => {
//   const payload = await request.json();
//   const header = headers();

//   const heads = {
//     "svix-id": header.get("svix-id"),
//     "svix-timestamp": header.get("svix-timestamp"),
//     "svix-signature": header.get("svix-signature"),
//   };

//   // Activitate Webhook in the Clerk Dashboard.
//   // After adding the endpoint, you'll see the secret on the right side.
//   const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");

//   let evnt: Event | null = null;

//   try {
//     evnt = wh.verify(
//       JSON.stringify(payload),
//       heads as IncomingHttpHeaders & WebhookRequiredHeaders
//     ) as Event;
//   } catch (err) {
//     return NextResponse.json({ message: err }, { status: 400 });
//   }

//   const eventType: EventType = evnt?.type!;

//   // Listen organization creation event
//   if (eventType === "organization.created") {
//     // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/CreateOrganization
//     // Show what evnt?.data sends from above resource
//     const { id, name, slug, logo_url, image_url, created_by } =
//       evnt?.data ?? {};

//     try {
//       // @ts-ignore
//       await createCommunity(
//         // @ts-ignore
//         id,
//         name,
//         slug,
//         logo_url || image_url,
//         "org bio",
//         created_by
//       );

//       return NextResponse.json({ message: "User created" }, { status: 201 });
//     } catch (err) {
//       console.log(err);
//       return NextResponse.json(
//         { message: "Internal Server Error" },
//         { status: 500 }
//       );
//     }
//   }

//   // Listen organization invitation creation event.
//   // Just to show. You can avoid this or tell people that we can create a new mongoose action and
//   // add pending invites in the database.
//   if (eventType === "organizationInvitation.created") {
//     try {
//       // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Invitations#operation/CreateOrganizationInvitation
//       console.log("Invitation created", evnt?.data);

//       return NextResponse.json(
//         { message: "Invitation created" },
//         { status: 201 }
//       );
//     } catch (err) {
//       console.log(err);

//       return NextResponse.json(
//         { message: "Internal Server Error" },
//         { status: 500 }
//       );
//     }
//   }

//   // Listen organization membership (member invite & accepted) creation
//   if (eventType === "organizationMembership.created") {
//     try {
//       // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/CreateOrganizationMembership
//       // Show what evnt?.data sends from above resource
//       const { organization, public_user_data } = evnt?.data;
//       console.log("created", evnt?.data);

//       // @ts-ignore
//       await addMemberToCommunity(organization.id, public_user_data.user_id);

//       return NextResponse.json(
//         { message: "Invitation accepted" },
//         { status: 201 }
//       );
//     } catch (err) {
//       console.log(err);

//       return NextResponse.json(
//         { message: "Internal Server Error" },
//         { status: 500 }
//       );
//     }
//   }

//   // Listen member deletion event
//   if (eventType === "organizationMembership.deleted") {
//     try {
//       // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/DeleteOrganizationMembership
//       // Show what evnt?.data sends from above resource
//       const { organization, public_user_data } = evnt?.data;
//       console.log("removed", evnt?.data);

//       // @ts-ignore
//       await removeUserFromCommunity(public_user_data.user_id, organization.id);

//       return NextResponse.json({ message: "Member removed" }, { status: 201 });
//     } catch (err) {
//       console.log(err);

//       return NextResponse.json(
//         { message: "Internal Server Error" },
//         { status: 500 }
//       );
//     }
//   }

//   // Listen organization updation event
//   if (eventType === "organization.updated") {
//     try {
//       // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
//       // Show what evnt?.data sends from above resource
//       const { id, logo_url, name, slug } = evnt?.data;
//       console.log("updated", evnt?.data);

//       // @ts-ignore
//       await updateCommunityInfo(id, name, slug, logo_url);

//       return NextResponse.json({ message: "Member removed" }, { status: 201 });
//     } catch (err) {
//       console.log(err);

//       return NextResponse.json(
//         { message: "Internal Server Error" },
//         { status: 500 }
//       );
//     }
//   }

//   // Listen organization deletion event
//   if (eventType === "organization.deleted") {
//     try {
//       // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/DeleteOrganization
//       // Show what evnt?.data sends from above resource
//       const { id } = evnt?.data;
//       console.log("deleted", evnt?.data);

//       // @ts-ignore
//       await deleteCommunity(id);

//       return NextResponse.json(
//         { message: "Organization deleted" },
//         { status: 201 }
//       );
//     } catch (err) {
//       console.log(err);

//       return NextResponse.json(
//         { message: "Internal Server Error" },
//         { status: 500 }
//       );
//     }
//   }
// };
