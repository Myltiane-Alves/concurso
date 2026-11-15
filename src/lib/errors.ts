export class AppError extends Error {
  constructor(
    message: string,
    public status = 400
  ) {
    super(message);
  }
}

export function toErrorMessage(error: unknown) {
  if (error instanceof AppError) return error.message;
  console.error(error);
  return "Erro inesperado. Tente novamente.";
}
