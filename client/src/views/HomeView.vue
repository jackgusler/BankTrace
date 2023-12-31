<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { getSession } from "@/models/session";
import { useUpdateUser } from "@/models/session";

const { updateUser } = useUpdateUser();

onMounted(() => {
  updateBudget();
});

//if dropdown is active, close it on next click
document.addEventListener("click", (e) => {
  if ((e.target as Element).closest(".dropdown")) {
    return;
  }
  if (isBudgetOperatorActive.value) {
    isBudgetOperatorActive.value = false;
  }
  if (isSpentOperatorActive.value) {
    isSpentOperatorActive.value = false;
  }
  if (isMonthDropdownActive.value) {
    isMonthDropdownActive.value = false;
  }
  if (isYearDropdownActive.value) {
    isYearDropdownActive.value = false;
  }
});

const session = getSession();
const isColorsEnabled = ref(false);
const isNewRowModalActive = ref(false);
const isWarningModalActive = ref(false);
const isMessageActive = ref(false);
const isEditModalActive = ref(false);
const isMonthDropdownActive = ref(false);
const isYearDropdownActive = ref(false);

const newEditBudget = ref(0);
const newEditSpent = ref(0);
const operatorBudget = ref("+");
const operatorSpent = ref("+");
const isBudgetOperatorActive = ref(false);
const isSpentOperatorActive = ref(false);

const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(new Date().getFullYear());
const months = ref([
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]);
const years = ref([2023, 2024, 2025, 2026, 2027, 2028]);

const newCategory = ref("");
const newBudget = ref(0);
const newSpent = ref(0);
const currentCategory = ref("");
const currentBudget = ref(0);
const currentSpent = ref(0);

let yearIndex =
  session.user?.monthlyData.findIndex(
    (yearData) => yearData.year === selectedYear.value
  ) ?? 0;
let monthIndex =
  session.user?.monthlyData[yearIndex].months.findIndex(
    (month) => month.month === selectedMonth.value
  ) ?? 0;
const index = ref(0);

const totalBudget = ref(0);
const totalSpent = ref(0);

const backgroundColor = ref("");

watch([isColorsEnabled, totalBudget, totalSpent], () => {
  if (!isColorsEnabled.value) {
    backgroundColor.value = "#ffffff";
  } else if (totalBudget.value < totalSpent.value) {
    backgroundColor.value = "#ff7070";
  } else if (totalBudget.value == totalSpent.value) {
    backgroundColor.value = "#ffec70";
  } else if (totalBudget.value > totalSpent.value) {
    backgroundColor.value = "#70ff91";
  }
});

function updateSelectedMonth(month: number) {
  isMonthDropdownActive.value = false;
  isYearDropdownActive.value = false;
  selectedMonth.value = month;
  updateBudget();
}

function updateSelectedYear(year: number) {
  isMonthDropdownActive.value = false;
  isYearDropdownActive.value = false;
  selectedYear.value = year;
  updateBudget();
}

function updateBudget() {
  // Find the selected month and year in the user's monthlyData
  const selectedMonthData = session.user?.monthlyData
    .find((yearData) => yearData.year === selectedYear.value)
    ?.months.find((month) => month.month === selectedMonth.value);

  // Update totalBudget and totalSpent based on the selected month's data
  if (selectedMonthData) {
    // Sum up all the budget values for the selected month
    totalBudget.value = selectedMonthData.budget.reduce(
      (sum, budget) => sum + budget,
      0
    );

    // Sum up all the spent values for the selected month
    totalSpent.value = selectedMonthData.spent.reduce(
      (sum, spent) => sum + spent,
      0
    );

    // Update the index values for the selected month and year
    yearIndex = session.user?.monthlyData.findIndex(
      (yearData) => yearData.year === selectedYear.value
    ) ?? 0
    monthIndex = session.user?.monthlyData[yearIndex].months.findIndex(
      (month) => month.month === selectedMonth.value
    ) ?? 0
  } else {
    // Set default values if data for the selected month is not found
    totalBudget.value = 0;
    totalSpent.value = 0;
  }
}

function closeNewRowModal() {
  isNewRowModalActive.value = false;
  isMessageActive.value = false;
}

function check() {
  if (newCategory.value == "" || newBudget.value == 0) {
    isMessageActive.value = true;
  } else {
    closeModal();
  }
}

function closeModal() {
  if (session.user) {
    const yearDataIndex = session.user.monthlyData.findIndex(
      (yearData) => yearData.year === selectedYear.value
    );

    if (yearDataIndex !== -1) {
      const monthIndex = session.user.monthlyData[yearDataIndex].months.findIndex(
        (month) => month.month === selectedMonth.value
      );

      if (monthIndex !== -1) {
        // Month exists, update the existing data
        const updatedCategories = session.user.monthlyData[yearDataIndex].months[monthIndex].categories.concat(newCategory.value);
        const updatedBudget = session.user.monthlyData[yearDataIndex].months[monthIndex].budget.concat(newBudget.value);
        const updatedSpent = session.user.monthlyData[yearDataIndex].months[monthIndex].spent.concat(newSpent.value);

        const updatedMonthlyData = [...session.user.monthlyData];
        updatedMonthlyData[yearDataIndex].months[monthIndex] = {
          month: selectedMonth.value,
          categories: updatedCategories,
          budget: updatedBudget,
          spent: updatedSpent,
        };

        updateUser(
          String(session.user.id),
          session.user.name,
          session.user.email,
          session.user.password,
          updatedMonthlyData
        );
      } else {
        // Month doesn't exist, create a new entry for the selected month
        const newMonthData = {
          month: selectedMonth.value,
          categories: [newCategory.value],
          budget: [newBudget.value],
          spent: [newSpent.value],
        };

        const updatedMonthlyData = [...session.user.monthlyData];
        updatedMonthlyData[yearDataIndex].months.push(newMonthData);

        updateUser(
          String(session.user.id),
          session.user.name,
          session.user.email,
          session.user.password,
          updatedMonthlyData
        );
      }
    } else {
      // Year doesn't exist, create a new entry for the selected year and month
      const newMonthData = {
        month: selectedMonth.value,
        categories: [newCategory.value],
        budget: [newBudget.value],
        spent: [newSpent.value],
      };

      const newYearData = {
        year: selectedYear.value,
        months: [newMonthData],
      };

      const updatedMonthlyData = [...session.user.monthlyData];
      updatedMonthlyData.push(newYearData);

      updateUser(
        String(session.user.id),
        session.user.name,
        session.user.email,
        session.user.password,
        updatedMonthlyData
      );
    }
    totalBudget.value += Number(newBudget.value);
    totalSpent.value += Number(newSpent.value);
  }
  newCategory.value = "";
  newBudget.value = 0;
  newSpent.value = 0;
  isNewRowModalActive.value = false;
  isMessageActive.value = false;
}

function closeEditModal() {
  //instead of pushing new values, like closeModal(), replace the old ones

  if (session.user) {
    // Update budget
    const updatedBudget = operatorBudget.value === "+" ?
      currentBudget.value + newEditBudget.value :
      currentBudget.value - newEditBudget.value;

    // Update spent
    const updatedSpent = operatorSpent.value === "-" ?
      currentSpent.value - newEditSpent.value :
      currentSpent.value + newEditSpent.value;

    // Update categories
    const updatedCategories = [...session.user.monthlyData[yearIndex].months[monthIndex].categories];
    updatedCategories[index.value] = currentCategory.value;

    // Create the updated monthlyData
    const updatedMonthlyData = [...session.user.monthlyData];
    updatedMonthlyData[yearIndex].months[monthIndex] = {
      ...updatedMonthlyData[yearIndex].months[monthIndex],
      budget: [...updatedMonthlyData[yearIndex].months[monthIndex].budget],
      spent: [...updatedMonthlyData[yearIndex].months[monthIndex].spent],
      categories: updatedCategories,
    };

    // Update the specific values in the updatedMonthlyData
    updatedMonthlyData[yearIndex].months[monthIndex].budget[index.value] = updatedBudget;
    updatedMonthlyData[yearIndex].months[monthIndex].spent[index.value] = updatedSpent;

    // Call updateUser with the updated monthlyData
    updateUser(
      String(session.user.id),
      session.user.name,
      session.user.email,
      session.user.password,
      updatedMonthlyData
    );
  }

  updateBudget();
  newEditBudget.value = 0;
  newEditSpent.value = 0;
  operatorBudget.value = "+";
  operatorSpent.value = "+";
  isBudgetOperatorActive.value = false;
  isSpentOperatorActive.value = false;
  isEditModalActive.value = false;
}

function cancelEditModal() {
  isEditModalActive.value = false;
  isBudgetOperatorActive.value = false;
  isSpentOperatorActive.value = false;
}

function closeWarningModal() {
  if (session.user) {
    const yearIndex = session.user.monthlyData.findIndex(
      (yearData) => yearData.year === selectedYear.value
    );

    if (yearIndex !== -1) {
      const monthData = session.user.monthlyData[yearIndex].months.find(
        (month) => month.month === selectedMonth.value
      );

      if (monthData) {
        // Update categories, budget, and spent by removing the item at the specified index
        const updatedCategories = [...monthData.categories];
        updatedCategories.splice(index.value, 1);

        const updatedBudget = [...monthData.budget];
        updatedBudget.splice(index.value, 1);

        const updatedSpent = [...monthData.spent];
        updatedSpent.splice(index.value, 1);

        // Update the server data using useUpdateUser
        updateUser(
          String(session.user.id),
          session.user.name,
          session.user.email,
          session.user.password,
          // Construct the updated monthlyData
          session.user.monthlyData.map((yearData, idx) => ({
            ...yearData,
            months: idx === yearIndex
              ? yearData.months.map((existingMonth) => existingMonth.month === selectedMonth.value
                  ? { ...existingMonth, categories: updatedCategories, budget: updatedBudget, spent: updatedSpent }
                  : existingMonth
                )
              : yearData.months
          }))
        );

        // Update any other necessary state or perform additional actions
        updateBudget();
        isWarningModalActive.value = false;
      }
    }
  }
}

function editRow(categoryIndex: number) {
  isEditModalActive.value = true;
  index.value = categoryIndex;

  // Based on the categoryIndex, find the category, budget, and spent values
  currentCategory.value =
    session.user?.monthlyData[
      session.user.monthlyData.findIndex(
        (yearData) => yearData.year === selectedYear.value
      )
    ]?.months.filter((month) => month.month === selectedMonth.value)[0]
      .categories[categoryIndex] ?? "";
  currentBudget.value =
    session.user?.monthlyData[
      session.user.monthlyData.findIndex(
        (yearData) => yearData.year === selectedYear.value
      )
    ]?.months.filter((month) => month.month === selectedMonth.value)[0].budget[
    categoryIndex
    ] ?? 0;
  currentSpent.value =
    session.user?.monthlyData[
      session.user.monthlyData.findIndex(
        (yearData) => yearData.year === selectedYear.value
      )
    ]?.months.filter((month) => month.month === selectedMonth.value)[0].spent[
    categoryIndex
    ] ?? 0;
}

function deleteRow(categoryIndex: number) {
  isWarningModalActive.value = true;
  index.value = categoryIndex;
}
</script>

<template>
  <div class="modal" :class="{ 'is-active': isNewRowModalActive }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">Category</label>
          <div class="control">
            <input class="input" type="text" placeholder="ex: Groceries" v-model="newCategory" maxLength="15" />
          </div>
        </div>
        <div class="field">
          <label class="label">Budget</label>
          <div class="control">
            <input class="input" type="number" v-model="newBudget" />
          </div>
        </div>
        <div class="field">
          <label class="label">Spent</label>
          <div class="control">
            <input class="input" type="number" v-model="newSpent" />
          </div>
        </div>
        <div class="message is-danger" v-if="isMessageActive">
          <div class="message-body">A category and budget must be entered.</div>
        </div>
        <div class="buttons">
          <div class="button" @click="check">Save changes</div>
          <div class="button" @click="closeNewRowModal">Cancel</div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" :class="{ 'is-active': isWarningModalActive }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="message is-danger">
          <div class="message-body">
            Are you sure you want to delete
            {{
              session.user?.monthlyData[yearIndex].months[monthIndex]
                .categories[index]
            }}?
          </div>
        </div>
        <div class="buttons">
          <div class="button is-danger" @click="closeWarningModal">Yes</div>
          <div class="button" @click="isWarningModalActive = false">No</div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal" :class="{ 'is-active': isEditModalActive }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="field">
          <label class="label">Category</label>
          <div class="control">
            <input class="input" type="text" placeholder="ex: Groceries" v-model="currentCategory" maxLength="15" />
          </div>
        </div>
        <div class="field">
          <label class="label">Budget:</label>
          <div class="control">
            <div class="field is-grouped">
              <input class="input" type="number" v-model="currentBudget" />
              <div class="dropdown" :class="{ 'is-active': isBudgetOperatorActive }">
                <!-- Dropdown to select add or subtract -->
                <div class="dropdown-trigger">
                  <button class="button" aria-haspopup="true" aria-controls="dropdown-menu"
                    @click="isBudgetOperatorActive = !isBudgetOperatorActive">
                    <span>{{ operatorBudget }}</span>
                    <span class="icon is-small">
                      <i class="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                  </button>
                  <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      <a class="dropdown-item" @click="
                        (operatorBudget = '+') &&
                        (isBudgetOperatorActive = false)
                        " :class="{ 'is-selected': operatorBudget == '+' }">+</a>
                      <a class="dropdown-item" @click="
                        (operatorBudget = '-') &&
                        (isBudgetOperatorActive = false)
                        " :class="{ 'is-selected': operatorBudget == '-' }">-</a>
                    </div>
                  </div>
                </div>
              </div>
              <input class="input" type="number" v-model="newEditBudget" />
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label">Spent:</label>
          <div class="field is-grouped">
            <input class="input" type="number" v-model="currentSpent" />
            <div class="dropdown" :class="{ 'is-active': isSpentOperatorActive }">
              <!-- Dropdown to select add or subtract -->
              <div class="dropdown-trigger">
                <button class="button" aria-haspopup="true" aria-controls="dropdown-menu"
                  @click="isSpentOperatorActive = !isSpentOperatorActive">
                  <span>{{ operatorSpent }}</span>
                  <span class="icon is-small">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                  <div class="dropdown-content">
                    <a class="dropdown-item" @click="
                      (operatorSpent = '+') && (isSpentOperatorActive = false)
                      " :class="{ 'is-selected': operatorSpent == '+' }">+</a>
                    <a class="dropdown-item" @click="
                      (operatorSpent = '-') && (isSpentOperatorActive = false)
                      " :class="{ 'is-selected': operatorSpent == '-' }">-</a>
                  </div>
                </div>
              </div>
            </div>
            <input class="input" type="number" v-model="newEditSpent" />
          </div>
        </div>
        <div class="buttons">
          <div class="button" @click="closeEditModal">Save changes</div>
          <div class="button" @click="cancelEditModal">Cancel</div>
        </div>
      </div>
    </div>
  </div>
  <div class="panel">
    <div class="panel-heading is-centered">
      {{ session.user?.name }}'s Budget
      <div class="field is-grouped">
        <!-- calender to select month and year using bulmas dropdown -->
        <div class="dropdown month" :class="{ 'is-active': isMonthDropdownActive }">
          <div class="dropdown-trigger">
            <div class="button" aria-haspopup="true" aria-controls="year-dropdown"
              @click="isMonthDropdownActive = !isMonthDropdownActive">
              <span>{{ months[selectedMonth - 1] }}</span>
              <span class="icon is-small">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </div>
            <div class="dropdown-menu" id="month-dropdown" role="menu">
              <div class="dropdown-content">
                <a class="dropdown-item" @click="updateSelectedMonth(index + 1)" v-for="(month, index) in months"
                  :key="index" :class="{ 'is-selected': index + 1 == selectedMonth }">
                  {{ month }}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="dropdown year" :class="{ 'is-active': isYearDropdownActive }">
          <div class="dropdown-trigger">
            <div class="button" aria-haspopup="true" aria-controls="year-dropdown"
              @click="isYearDropdownActive = !isYearDropdownActive">
              <span>{{ selectedYear }}</span>
              <span class="icon is-small">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </div>
          </div>
          <div class="dropdown-menu" id="year-dropdown" role="menu">
            <div class="dropdown-content">
              <a class="dropdown-item" @click="updateSelectedYear(year)" v-for="year in years" :key="year"
                :class="{ 'is-selected': year == selectedYear }">
                {{ year }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-body">
      <div class="table-container">
        <table class="table is-fullwidth is-narrow">
          <thead>
            <tr>
              <th>Categories</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody v-for="(month, monthIndex) in session.user?.monthlyData[
            session.user.monthlyData.findIndex(
              (yearData) => yearData.year === selectedYear
            )
          ]?.months.filter((month) => month.month === selectedMonth)" :key="monthIndex">
            <tr v-for="(category, categoryIndex) in month.categories" :key="categoryIndex" :class="{
              'is-over':
                (month.budget[categoryIndex] ?? 0) <
                (month.spent[categoryIndex] ?? 0),
              'is-even':
                month.budget[categoryIndex] === month.spent[categoryIndex],
              'is-below':
                (month.budget[categoryIndex] ?? 0) >
                (month.spent[categoryIndex] ?? 0),
              'is-colors-enabled': !isColorsEnabled,
            }">
              <td>{{ category }}</td>
              <td>${{ month.budget[categoryIndex] }}</td>
              <td>${{ month.spent[categoryIndex] }}</td>
              <td>
                <div class="button action" @click="editRow(categoryIndex)" :class="{ 'is-info': isColorsEnabled }">
                  <span class="icon is-small">
                    <i class="fas fa-edit"></i>
                  </span>
                </div>
                <div class="button action" @click="deleteRow(categoryIndex)" :class="{ 'is-danger': isColorsEnabled }">
                  <span class="icon is-small">
                    <i class="fas fa-trash"></i>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr class="total" :class="{
              'is-over': totalBudget < totalSpent,
              'is-even': totalBudget == totalSpent,
              'is-below': totalBudget > totalSpent,
              'is-colors-enabled': !isColorsEnabled,
            }">
              <td :style="{ backgroundColor: backgroundColor, bottom: 0 }">
                Total
              </td>
              <td :style="{ backgroundColor: backgroundColor, bottom: 0 }">
                ${{ totalBudget }}
              </td>
              <td :style="{ backgroundColor: backgroundColor, bottom: 0 }">
                ${{ totalSpent }}
              </td>
              <td :style="{ backgroundColor: backgroundColor, bottom: 0 }"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="buttons">
      <div class="button" @click="isNewRowModalActive = true">Add Row</div>
      <div class="button" @click="isColorsEnabled = !isColorsEnabled">
        <label class="checkbox" @click.stop>
          <input type="checkbox" v-model="isColorsEnabled" />
          Toggle Colors
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-title {
  text-align: center;
}

.is-over {
  background-color: #ff7070;
}

.is-even {
  background-color: #ffec70;
}

.is-below {
  background-color: #70ff91;
}

.is-colors-enabled {
  background-color: #ffffff;
}

.is-grouped {
  display: flex;
  justify-content: center;
}

.is-centered {
  text-align: center;
  justify-content: center;
}

.dropdown-content {
  justify-content: center;
  padding: 0;
  width: 4rem;
  margin-right: 0.2rem;
  margin-left: 0.2rem;
}

.dropdown-menu {
  min-width: 0;
  padding: 0;
}

.is-grouped .button {
  margin-right: 0.2rem;
  margin-left: 0.2rem;
}

.dropdown-item {
  padding: 0.2rem;
  text-align: center;
}

.action {
  margin: 0 0.2rem;
}

.table.is-bordered td,
.table.is-bordered th {
  border: 1px solid #000000;
}

button.button {
  width: 4rem;
}

.month {
  margin-right: 1rem;
}

.month .button,
.year .button {
  margin-top: 0.5rem;
  width: 8rem;
}

.month .dropdown-menu,
.year .dropdown-menu,
.month .dropdown-content,
.year .dropdown-content {
  width: 8rem;
}

.month .dropdown-content a,
.year .dropdown-content a,
.dropdown-item {
  border-bottom: 1px solid #000000;
}

.is-selected {
  background-color: #000000;
  color: #ffffff;
}

.panel {
  max-height: calc(100vh - 52px);
}

.table-container {
  height: calc(100vh - 52px - 11rem);
  overflow: auto;
}

table {
  border-left: 1px solid #000000;
}

.table-container table {
  border-collapse: separate;
}

.table-container table thead th {
  position: sticky;
  border-top: 1px solid #000000;
  border-bottom: 1px solid #000000;
  z-index: 19;
}

.table-container table .total td {
  position: sticky;
  border-top: 1px solid #000000;
  border-bottom: 1px solid #000000;
  z-index: 19;
}

table td,
table th {
  border-bottom: 1px solid #000000;
  border-right: 1px solid #000000;
}

.table-container table thead th {
  top: 0;
  background: white;
  /* To prevent content underneath from showing through */
}
</style>
