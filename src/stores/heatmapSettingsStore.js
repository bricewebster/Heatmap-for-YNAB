import { writable } from "svelte/store";

export const heatmapSettingsStore = writable({
    defaultColors: {incomeHue: 157, incomeSat: 100, incomeLum: 32, expenseHue: 342, expenseSat: 100, expenseLum: 62,
              incomeTopHue: 157, incomeTopSat: 100, incomeTopLum: 32, incomeHighHue: 111, incomeHighSat: 39, incomeHighLum: 57, 
              incomeLowHue: 76, incomeLowSat: 52, incomeLowLum: 63, incomeBottomHue: 52, incomeBottomSat: 84, incomeBottomLum: 76,
              expenseTopHue: 34, expenseTopSat: 81, expenseTopLum: 54, expenseHighHue: 22, expenseHighSat: 75, expenseHighLum: 57,
              expenseLowHue: 4, expenseLowSat: 66, expenseLowLum: 60, expenseBottomHue: 343, expenseBottomSat: 63, expenseBottomLum: 54},
    Colors: {incomeHue: 157, incomeSat: 0, incomeLum: 32, expenseHue: 342, expenseSat: 100, expenseLum: 62,
                incomeTopHue: 157, incomeTopSat: 100, incomeTopLum: 32, incomeHighHue: 111, incomeHighSat: 39, incomeHighLum: 57, 
                incomeLowHue: 76, incomeLowSat: 52, incomeLowLum: 63, incomeBottomHue: 52, incomeBottomSat: 84, incomeBottomLum: 76,
                expenseTopHue: 343, expenseTopSat: 63, expenseTopLum: 54, expenseHighHue: 4, expenseHighSat: 66, expenseHighLum: 60,
                expenseLowHue: 22, expenseLowSat: 75, expenseLowLum: 57, expenseBottomHue: 34, expenseBottomSat: 81, expenseBottomLum: 54},
    Budgets: [],
    selectedBudget: {Id: '', Name: ''} 
});

export default heatmapSettingsStore;