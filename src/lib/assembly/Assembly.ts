export interface Motion {
    title: string;
    link: string;
    presenter: string;
}

export interface AgendaItemCommons {
    digit: string;
    title: string;
}

export interface AgendaItemOpening extends AgendaItemCommons {
    type: "opening";
}

export interface AgendaItemChairpersonElection extends AgendaItemCommons {
    type: "chairperson-election";
}

export interface AgendaItemCountingCommissionElection extends AgendaItemCommons {
    type: "counting-commission-election";
    candidates: string[];
}

export interface AgendaItemAgendaApproval extends AgendaItemCommons {
    type: "agenda-approval";
}

export interface AgendaItemMotionOrder extends AgendaItemCommons {
    type: "motion-order";
}

export interface AgendaItemAmendments extends AgendaItemCommons {
    type: "amendments";
    motions: string[];
}

export interface ElectionSystem {
    norm: string;
}

export interface AgendaItemElection extends AgendaItemCommons {
    type: "election";
    system: ElectionSystem[];
    candidates: string[];
}

export interface AgendaItemClosing extends AgendaItemCommons {
    type: "closing";
}

export type AgendaItem = AgendaItemOpening
    | AgendaItemChairpersonElection | AgendaItemCountingCommissionElection
    | AgendaItemAgendaApproval | AgendaItemMotionOrder | AgendaItemAmendments
    | AgendaItemElection | AgendaItemClosing;

export interface Assembly {
    event: string;
    association: string;
    start: string;
    location: string;
    motions: { [name: string]: Motion };
    agenda: AgendaItem[];
}
