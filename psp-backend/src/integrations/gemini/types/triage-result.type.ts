export type ChatIntent =
  | 'general_guidance'
  | 'risk_assessment'
  | 'evidence_preservation'
  | 'psp_referral'
  | 'emotional_support'
  | 'unclear';

export type ChatResult = {
  reply: string;
  intent: ChatIntent;
  shouldSuggestPsp: boolean;
  suggestedActions: string[];
};
