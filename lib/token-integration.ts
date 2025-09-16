import { TokenManager, TOKEN_COSTS, TOKEN_REWARDS } from "./token-system"

export function spendTokensForAI(feature: keyof typeof TOKEN_COSTS): boolean {
  const tokenManager = TokenManager.getInstance()
  const cost = TOKEN_COSTS[feature]

  return tokenManager.spendTokens(cost, getSpendReason(feature))
}

export function earnTokensForStep(step: keyof typeof TOKEN_REWARDS): boolean {
  const tokenManager = TokenManager.getInstance()
  const reward = TOKEN_REWARDS[step]

  return tokenManager.earnTokens(reward, getEarnReason(step), step)
}

function getSpendReason(feature: keyof typeof TOKEN_COSTS): string {
  const reasons = {
    RESEARCH_ANALYSIS: "AI Research Analysis",
    AI_CHAT_MESSAGE: "AI Assistant Chat",
    QUESTION_EVALUATION: "Question Evaluation",
    WHAT_IF_ANALYSIS: "What-If Analysis",
    IMPLEMENTATION_GENERATION: "Implementation Planning",
    MISSION_STEPS: "Mission Step Generation",
  }
  return reasons[feature]
}

function getEarnReason(step: keyof typeof TOKEN_REWARDS): string {
  const reasons = {
    HOMEBASE_STARTUP_INFO: "Completed Startup Info",
    RESEARCH_OVERVIEW_COMPLETE: "Research Overview Complete",
    FIRST_QUESTION_EVALUATION: "First Question Evaluation",
    MOM_TEST_GOOD_SCORE: "Mom Test High Score",
    PRODUCT_ACTION_TABLE: "Product Action Table",
    SALES_VALUE_PROPOSITION: "Value Proposition Canvas",
    INTERVIEW_QUESTIONS_SAVED: "Interview Questions Saved",
  }
  return reasons[step]
}

export function checkTokenBalance(): number {
  const tokenManager = TokenManager.getInstance()
  return tokenManager.getState().balance
}

export function hasEnoughTokens(feature: keyof typeof TOKEN_COSTS): boolean {
  return true

  // Original logic commented out for later restoration:
  // const tokenManager = TokenManager.getInstance()
  // const cost = TOKEN_COSTS[feature]
  // return tokenManager.canSpend(cost)
}
