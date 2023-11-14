<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getSession } from "@/models/session";

onMounted(() => {
  updateBudget();
});

const session = getSession();
const isColorsEnabled = ref(false);
const isModalActive = ref(false);
const isWarningModalActive = ref(false);
const isMessageActive = ref(false);
const isEditModalActive = ref(false);

const newEditBudget = ref(0);
const newEditSpent = ref(0);
const operatorBudget = ref("+");
const operatorSpent = ref("+");

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

function updateBudget() {
  // Update the yearIndex and monthIndex
  yearIndex =
    session.user?.monthlyData.findIndex(
      (yearData) => yearData.year === selectedYear.value
    ) ?? 0;
  monthIndex =
    session.user?.monthlyData[yearIndex].months.findIndex(
      (month) => month.month === selectedMonth.value
    ) ?? 0;

  // Find the selected month and year in the user's monthlyData
  const selectedMonthData = session.user?.monthlyData.find(
    (yearData) =>
      yearData.year === selectedYear.value &&
      yearData.months.some((month) => month.month === selectedMonth.value)
  );

  // Update totalBudget and totalSpent based on the selected month's data
  if (selectedMonthData) {
    const selectedMonthBudget = selectedMonthData.months.find(
      (month) => month.month === selectedMonth.value
    );

    if (selectedMonthBudget) {
      // Sum up all the budget values for the selected month
      totalBudget.value = selectedMonthBudget.budget.reduce(
        (sum, budget) => sum + budget,
        0
      );

      // Sum up all the spent values for the selected month
      totalSpent.value = selectedMonthBudget.spent.reduce(
        (sum, spent) => sum + spent,
        0
      );
    }
  } else {
    // Set default values if data for the selected month is not found
    totalBudget.value = 0;
    totalSpent.value = 0;
  }
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
    // Find the index of the selected year in monthlyData

    if (yearIndex !== -1) {
      // Year exists, find the index of the selected month

      if (monthIndex !== -1) {
        // Month exists, update the existing data
        session.user.monthlyData[yearIndex].months[monthIndex].categories.push(
          newCategory.value
        );
        session.user.monthlyData[yearIndex].months[monthIndex].budget.push(
          newBudget.value
        );
        session.user.monthlyData[yearIndex].months[monthIndex].spent.push(
          newSpent.value
        );
      } else {
        // Month doesn't exist, create a new entry for the selected month
        session.user.monthlyData[yearIndex].months.push({
          month: selectedMonth.value,
          categories: [newCategory.value],
          budget: [newBudget.value],
          spent: [newSpent.value],
        });
      }
    } else {
      // Year doesn't exist, create a new entry for the selected year and month
      session.user.monthlyData.push({
        year: selectedYear.value,
        months: [
          {
            month: selectedMonth.value,
            categories: [newCategory.value],
            budget: [newBudget.value],
            spent: [newSpent.value],
          },
        ],
      });
    }
    totalBudget.value += Number(newBudget.value);
    totalSpent.value += Number(newSpent.value);
  }
  newCategory.value = "";
  newBudget.value = 0;
  newSpent.value = 0;
  isModalActive.value = false;
  isMessageActive.value = false;
}

function closeEditModal() {
  //instead of pushing new values, like closeModal(), replace the old ones
  if (session.user) {
    if (operatorBudget.value == "+") {
      session.user.monthlyData[yearIndex].months[monthIndex].budget[
        index.value
      ] = currentBudget.value + newEditBudget.value;
    } else {
      session.user.monthlyData[yearIndex].months[monthIndex].budget[
        index.value
      ] = currentBudget.value - newEditBudget.value;
    }
    if (operatorSpent.value == "-") {
      session.user.monthlyData[yearIndex].months[monthIndex].spent[
        index.value
      ] = currentSpent.value - newEditSpent.value;
    } else {
      session.user.monthlyData[yearIndex].months[monthIndex].spent[
        index.value
      ] = currentSpent.value + newEditSpent.value;
    }
    session.user.monthlyData[yearIndex].months[monthIndex].categories[
      index.value
    ] = currentCategory.value;
  }
  updateBudget();
  newEditBudget.value = 0;
  newEditSpent.value = 0;
  operatorBudget.value = "+";
  operatorSpent.value = "+";
  isEditModalActive.value = false;
}

function closeWarningModal() {
  session.user?.monthlyData[
    session.user.monthlyData.findIndex(
      (yearData) => yearData.year === selectedYear.value
    )
  ]?.months
    .filter((month) => month.month === selectedMonth.value)[0]
    .categories.splice(index.value, 1);
  session.user?.monthlyData[
    session.user.monthlyData.findIndex(
      (yearData) => yearData.year === selectedYear.value
    )
  ]?.months
    .filter((month) => month.month === selectedMonth.value)[0]
    .budget.splice(index.value, 1);
  session.user?.monthlyData[
    session.user.monthlyData.findIndex(
      (yearData) => yearData.year === selectedYear.value
    )
  ]?.months
    .filter((month) => month.month === selectedMonth.value)[0]
    .spent.splice(index.value, 1);

  updateBudget();
  isWarningModalActive.value = false;
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
  <div>
    <div class="modal" :class="{ 'is-active': isModalActive }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <div class="field">
            <label class="label">Category</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="ex: Groceries"
                v-model="newCategory"
                maxLength="15"
              />
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
            <div class="message-body">
              A category and budget must be entered.
            </div>
          </div>
          <div class="buttons">
            <div class="button is-primary" @click="check">Save changes</div>
            <div class="button" @click="isModalActive = false">Cancel</div>
          </div>
        </div>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="isModalActive = false"
      ></button>
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
              <input
                class="input"
                type="text"
                placeholder="ex: Groceries"
                v-model="currentCategory"
                maxLength="15"
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Budget: ${{ currentBudget }}</label>
            <div class="control">
              <div class="field is-grouped">
                <div class="dropdown is-hoverable">
                  <!-- Dropdown to select add or subtract -->
                  <div class="dropdown-trigger">
                    <button
                      class="button"
                      aria-haspopup="true"
                      aria-controls="dropdown-menu"
                    >
                      <span>{{ operatorBudget }}</span>
                      <span class="icon is-small">
                        <i class="fas fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </button>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                      <div class="dropdown-content">
                        <a class="dropdown-item" @click="operatorBudget = '+'"
                          >+</a
                        >
                        <a class="dropdown-item" @click="operatorBudget = '-'"
                          >-</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <input class="input" type="number" v-model="newEditBudget" />
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Spent: ${{ currentSpent }}</label>
            <div class="field is-grouped">
              <div class="dropdown is-hoverable">
                <!-- Dropdown to select add or subtract -->
                <div class="dropdown-trigger">
                  <button
                    class="button"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                  >
                    <span>{{ operatorSpent }}</span>
                    <span class="icon is-small">
                      <i class="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                  </button>
                  <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                      <a class="dropdown-item" @click="operatorSpent = '+'"
                        >+</a
                      >
                      <a class="dropdown-item" @click="operatorSpent = '-'"
                        >-</a
                      >
                    </div>
                  </div>
                </div>
              </div>
              <input class="input" type="number" v-model="newEditSpent" />
            </div>
          </div>
          <div class="buttons">
            <div class="button is-primary" @click="closeEditModal">
              Save changes
            </div>
            <div class="button" @click="isEditModalActive = false">Cancel</div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-heading">
        <h3 class="panel-title">
          {{ session.user?.name }}'s Budget
          <!-- calender to select month and year -->
          <select v-model="selectedMonth" @change="updateBudget">
            <option
              v-for="(month, index) in months"
              :key="index"
              :value="index + 1"
            >
              {{ month }}
            </option>
          </select>

          <select v-model="selectedYear" @change="updateBudget">
            <option v-for="(year, index) in years" :key="index" :value="year">
              {{ year }}
            </option>
          </select>
        </h3>
      </div>
      <div class="panel-body">
        <table class="table is-fullwidth is-bordered is-narrow">
          <thead>
            <tr>
              <th>Categories</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody
            v-for="(month, monthIndex) in session.user?.monthlyData[
              session.user.monthlyData.findIndex(
                (yearData) => yearData.year === selectedYear
              )
            ]?.months.filter((month) => month.month === selectedMonth)"
            :key="monthIndex"
          >
            <tr
              v-for="(category, categoryIndex) in month.categories"
              :key="categoryIndex"
              :class="{
                'is-over':
                  (month.budget[categoryIndex] ?? 0) <
                  (month.spent[categoryIndex] ?? 0),
                'is-even':
                  month.budget[categoryIndex] === month.spent[categoryIndex],
                'is-below':
                  (month.budget[categoryIndex] ?? 0) >
                  (month.spent[categoryIndex] ?? 0),
                'is-colors-enabled': !isColorsEnabled,
              }"
            >
              <td>{{ category }}</td>
              <td>${{ month.budget[categoryIndex] }}</td>
              <td>${{ month.spent[categoryIndex] }}</td>
              <td>
                <div class="button action" @click="editRow(categoryIndex)" :class="{'is-info': isColorsEnabled}">
                  <span class="icon is-small">
                    <i class="fas fa-edit"></i>
                  </span>
                </div>
                <div class="button action" @click="deleteRow(categoryIndex)" :class="{'is-danger': isColorsEnabled}">
                  <span class="icon is-small">
                    <i class="fas fa-trash"></i>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody>
            <tr
              :class="{
                'is-over': totalBudget < totalSpent,
                'is-even': totalBudget == totalSpent,
                'is-below': totalBudget > totalSpent,
                'is-colors-enabled': !isColorsEnabled,
              }"
            >
              <td>Total</td>
              <td>${{ totalBudget }}</td>
              <td>${{ totalSpent }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="buttons">
      <div class="button" @click="isModalActive = true">Add Row</div>
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
.buttons {
  display: flex;
  justify-content: center;
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
  align-items: center;
}
.dropdown {
  margin-right: 0.5rem;
}
.dropdown-content {
  /*make the text in the center*/
  justify-content: center;

  padding: 0;
  width: 4rem;
}
.dropdown-trigger, .dropdown-menu{
  margin: 0;
  padding: 0;
}
.dropdown-item{
  padding: .2rem;
  width: 4rem;
  text-align: center;
}
.button, .input{
  border: 1.2px solid #000000;
}
.button:hover{
  border: 1.2px solid #000000;
  background-color: #bbbbbb;
}
.action{
  margin: 0 .2rem;
}
.table.is-bordered td, .table.is-bordered th {
  border: 1px solid #000000;
}
</style>