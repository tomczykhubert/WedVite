import {
  AttendanceStatus,
  Gender,
  GuestType,
  InvitationStatus,
  PrismaClient,
} from "@prisma/client";

export interface GuestSeedData {
  name: string;
  status: AttendanceStatus;
  gender: Gender;
  type: GuestType;
  respondedAt?: Date;
}

export interface InvitationSeedData {
  name: string;
  status: InvitationStatus;
  responseDate?: Date;
  guests: GuestSeedData[];
}

// Invitations for each event (indexed by event order)
export const invitationsSeedData: Record<number, InvitationSeedData[]> = {
  0: [
    // Wedding event - comprehensive test cases
    {
      name: "The Anderson Family",
      status: InvitationStatus.ANSWERED,
      responseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      guests: [
        {
          name: "Robert Anderson",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.MALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Linda Anderson",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Emily Anderson",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.FEMALE,
          type: GuestType.CHILD,
          respondedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Jake Anderson",
          status: AttendanceStatus.DECLINED,
          gender: Gender.MALE,
          type: GuestType.CHILD,
          respondedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      name: "The Mitchell-Rodriguez Family",
      status: InvitationStatus.ANSWERED,
      responseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      guests: [
        {
          name: "Carlos Rodriguez",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.MALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Sarah Mitchell-Rodriguez",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Alex Rodriguez",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.UNSPECIFIED,
          type: GuestType.COMPANION,
          respondedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      name: "The Kim Family",
      status: InvitationStatus.DELIVERED,
      guests: [
        {
          name: "Jennifer Kim",
          status: AttendanceStatus.PENDING,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
        },
        {
          name: "David Kim",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.ADULT,
        },
        {
          name: "Sophie Kim",
          status: AttendanceStatus.PENDING,
          gender: Gender.FEMALE,
          type: GuestType.CHILD,
        },
      ],
    },
    {
      name: "The Williams Extended Family",
      status: InvitationStatus.ANSWERED,
      responseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      guests: [
        {
          name: "Patricia Williams",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Thomas Williams",
          status: AttendanceStatus.DECLINED,
          gender: Gender.MALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Grace Williams",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Michael Williams Jr.",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.MALE,
          type: GuestType.CHILD,
          respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Olivia Williams",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.FEMALE,
          type: GuestType.CHILD,
          respondedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      name: "College Friends Group",
      status: InvitationStatus.CREATED,
      guests: [
        {
          name: "Marcus Thompson",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.ADULT,
        },
        {
          name: "Jessica Chen",
          status: AttendanceStatus.PENDING,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
        },
        {
          name: "Ryan O'Connor",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.ADULT,
        },
        {
          name: "Aisha Patel",
          status: AttendanceStatus.PENDING,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
        },
      ],
    },
    {
      name: "Single Guest - Dr. Elizabeth Foster",
      status: InvitationStatus.ANSWERED,
      responseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      guests: [
        {
          name: "Dr. Elizabeth Foster",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      name: "The Johnson Family - Large Group",
      status: InvitationStatus.DELIVERED,
      guests: [
        {
          name: "William Johnson Sr.",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.ADULT,
        },
        {
          name: "Margaret Johnson",
          status: AttendanceStatus.PENDING,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
        },
        {
          name: "William Johnson Jr.",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.ADULT,
        },
        {
          name: "Amanda Johnson-Smith",
          status: AttendanceStatus.PENDING,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
        },
        {
          name: "Christopher Johnson",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.ADULT,
        },
        {
          name: "Isabella Johnson",
          status: AttendanceStatus.PENDING,
          gender: Gender.FEMALE,
          type: GuestType.CHILD,
        },
        {
          name: "Lucas Johnson",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.CHILD,
        },
        {
          name: "Sophia Johnson-Smith",
          status: AttendanceStatus.PENDING,
          gender: Gender.FEMALE,
          type: GuestType.CHILD,
        },
      ],
    },
  ],
  1: [
    // Corporate gala
    {
      name: "Executive Team Alpha",
      status: InvitationStatus.ANSWERED,
      responseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      guests: [
        {
          name: "Jonathan Pierce",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.MALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Victoria Pierce",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.FEMALE,
          type: GuestType.COMPANION,
          respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      name: "Marketing Department",
      status: InvitationStatus.DELIVERED,
      guests: [
        {
          name: "Rachel Green",
          status: AttendanceStatus.PENDING,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
        },
        {
          name: "Mark Stevens",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.ADULT,
        },
      ],
    },
    {
      name: "Board of Directors",
      status: InvitationStatus.CREATED,
      guests: [
        {
          name: "Harold Finch",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.ADULT,
        },
        {
          name: "Catherine Walsh",
          status: AttendanceStatus.PENDING,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
        },
        {
          name: "Dr. Ahmed Hassan",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.ADULT,
        },
      ],
    },
  ],
  2: [
    // Family reunion
    {
      name: "Thompson Core Family",
      status: InvitationStatus.ANSWERED,
      responseDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      guests: [
        {
          name: "Frank Thompson",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.MALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Helen Thompson",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Sam Thompson",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.MALE,
          type: GuestType.CHILD,
          respondedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Lucy Thompson",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.FEMALE,
          type: GuestType.CHILD,
          respondedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      name: "Thompson Extended - East Coast",
      status: InvitationStatus.DELIVERED,
      guests: [
        {
          name: "Daniel Thompson",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.ADULT,
        },
        {
          name: "Maria Thompson",
          status: AttendanceStatus.PENDING,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
        },
        {
          name: "Carlos Thompson",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.CHILD,
        },
      ],
    },
  ],
  3: [
    // Birthday celebration
    {
      name: "Close Friends Circle",
      status: InvitationStatus.ANSWERED,
      responseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      guests: [
        {
          name: "Kevin Murphy",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.MALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Lisa Murphy",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Nancy Wilson",
          status: AttendanceStatus.DECLINED,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          name: "Peter Clark",
          status: AttendanceStatus.CONFIRMED,
          gender: Gender.MALE,
          type: GuestType.ADULT,
          respondedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      ],
    },
    {
      name: "Work Colleagues",
      status: InvitationStatus.CREATED,
      guests: [
        {
          name: "Rebecca Martinez",
          status: AttendanceStatus.PENDING,
          gender: Gender.FEMALE,
          type: GuestType.ADULT,
        },
        {
          name: "Steven Garcia",
          status: AttendanceStatus.PENDING,
          gender: Gender.MALE,
          type: GuestType.ADULT,
        },
      ],
    },
  ],
};

export async function seedInvitationsAndGuests(
  prisma: PrismaClient,
  events: any[]
) {
  console.log("Seeding invitations and guests...");

  let totalInvitations = 0;
  let totalGuests = 0;

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const invitationsData = invitationsSeedData[i] || [];

    for (const invitationData of invitationsData) {
      const invitation = await prisma.invitation.create({
        data: {
          name: invitationData.name,
          status: invitationData.status,
          responseDate: invitationData.responseDate,
          eventId: event.id,
          guests: {
            create: invitationData.guests,
          },
        },
        include: {
          guests: true,
        },
      });

      totalInvitations += 1;
      totalGuests += invitation.guests.length;
    }
  }

  console.log(
    `Created ${totalInvitations} invitations with ${totalGuests} guests`
  );
}
