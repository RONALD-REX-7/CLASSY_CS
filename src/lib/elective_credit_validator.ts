export function validateElectiveCredits(earnedProfessional: number, earnedOpen: number, reqProfessional: number = 18, reqOpen: number = 9): boolean {
  return earnedProfessional >= reqProfessional && earnedOpen >= reqOpen;
}
