/* ============================================================
 * Форматирование денег: 500000 → «500 000 ₽»
 * ============================================================ */

export function formatMoney(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export function statusLabel(status: string): string {
  switch (status) {
    case "idea":
      return "Идея";
    case "preparation":
      return "Подготовка";
    case "registered":
      return "Зарегистрирован";
    case "open":
      return "Работает";
    case "closed":
      return "Закрыт";
    default:
      return status;
  }
}
