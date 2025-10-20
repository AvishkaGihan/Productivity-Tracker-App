import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, Divider, Menu, Searchbar } from "react-native-paper";
import { useTheme } from "../../theme";
import { TaskCategory, TaskPriority } from "./TaskCard";

interface TaskFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  activeFilters: FilterOptions;
}

export interface FilterOptions {
  search: string;
  status: "all" | "completed" | "pending";
  priority?: TaskPriority;
  category?: TaskCategory;
  sortBy: "created" | "priority" | "dueDate" | "alphabetical";
  sortOrder: "asc" | "desc";
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  onFilterChange,
  activeFilters,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState(activeFilters.search);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onFilterChange({ ...activeFilters, search: query });
  };

  const handleStatusFilter = (status: FilterOptions["status"]) => {
    onFilterChange({ ...activeFilters, status });
  };

  const handlePriorityFilter = (priority?: TaskPriority) => {
    onFilterChange({ ...activeFilters, priority });
  };

  const handleCategoryFilter = (category?: TaskCategory) => {
    onFilterChange({ ...activeFilters, category });
  };

  const handleSortChange = (sortBy: FilterOptions["sortBy"]) => {
    onFilterChange({ ...activeFilters, sortBy });
    setShowSortMenu(false);
  };

  const toggleSortOrder = () => {
    onFilterChange({
      ...activeFilters,
      sortOrder: activeFilters.sortOrder === "asc" ? "desc" : "asc",
    });
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    onFilterChange({
      search: "",
      status: "all",
      priority: undefined,
      category: undefined,
      sortBy: "created",
      sortOrder: "desc",
    });
  };

  const activeFilterCount =
    (activeFilters.status !== "all" ? 1 : 0) +
    (activeFilters.priority ? 1 : 0) +
    (activeFilters.category ? 1 : 0) +
    (activeFilters.search ? 1 : 0);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search tasks..."
        onChangeText={handleSearchChange}
        value={searchQuery}
        style={styles.searchBar}
        icon="magnify"
      />

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersRow}
        contentContainerStyle={styles.filtersContent}
      >
        {/* Status Chips */}
        <Chip
          selected={activeFilters.status === "all"}
          onPress={() => handleStatusFilter("all")}
          style={styles.chip}
          icon="format-list-bulleted"
        >
          All
        </Chip>
        <Chip
          selected={activeFilters.status === "pending"}
          onPress={() => handleStatusFilter("pending")}
          style={styles.chip}
          icon="clock-outline"
        >
          Pending
        </Chip>
        <Chip
          selected={activeFilters.status === "completed"}
          onPress={() => handleStatusFilter("completed")}
          style={styles.chip}
          icon="check-circle"
        >
          Completed
        </Chip>

        <View style={styles.divider} />

        {/* Priority Filters */}
        <Chip
          selected={activeFilters.priority === "high"}
          onPress={() =>
            handlePriorityFilter(
              activeFilters.priority === "high" ? undefined : "high"
            )
          }
          style={styles.chip}
          icon="flag"
          selectedColor={theme.colors.error}
        >
          High
        </Chip>
        <Chip
          selected={activeFilters.priority === "medium"}
          onPress={() =>
            handlePriorityFilter(
              activeFilters.priority === "medium" ? undefined : "medium"
            )
          }
          style={styles.chip}
          icon="flag"
          selectedColor={theme.colors.warning}
        >
          Medium
        </Chip>
        <Chip
          selected={activeFilters.priority === "low"}
          onPress={() =>
            handlePriorityFilter(
              activeFilters.priority === "low" ? undefined : "low"
            )
          }
          style={styles.chip}
          icon="flag"
          selectedColor={theme.colors.info}
        >
          Low
        </Chip>

        <View style={styles.divider} />

        {/* Category Filters */}
        <Chip
          selected={activeFilters.category === "work"}
          onPress={() =>
            handleCategoryFilter(
              activeFilters.category === "work" ? undefined : "work"
            )
          }
          style={styles.chip}
          icon="briefcase"
        >
          Work
        </Chip>
        <Chip
          selected={activeFilters.category === "personal"}
          onPress={() =>
            handleCategoryFilter(
              activeFilters.category === "personal" ? undefined : "personal"
            )
          }
          style={styles.chip}
          icon="account"
        >
          Personal
        </Chip>
        <Chip
          selected={activeFilters.category === "health"}
          onPress={() =>
            handleCategoryFilter(
              activeFilters.category === "health" ? undefined : "health"
            )
          }
          style={styles.chip}
          icon="heart"
        >
          Health
        </Chip>
        <Chip
          selected={activeFilters.category === "learning"}
          onPress={() =>
            handleCategoryFilter(
              activeFilters.category === "learning" ? undefined : "learning"
            )
          }
          style={styles.chip}
          icon="book-open-variant"
        >
          Learning
        </Chip>
      </ScrollView>

      {/* Sort & Filter Actions */}
      <View style={styles.actionsRow}>
        <Menu
          visible={showSortMenu}
          onDismiss={() => setShowSortMenu(false)}
          anchor={
            <Chip
              icon="sort"
              onPress={() => setShowSortMenu(true)}
              style={styles.chip}
            >
              Sort: {getSortLabel(activeFilters.sortBy)}
            </Chip>
          }
        >
          <Menu.Item
            onPress={() => handleSortChange("created")}
            title="Date Created"
            leadingIcon="calendar-plus"
          />
          <Menu.Item
            onPress={() => handleSortChange("priority")}
            title="Priority"
            leadingIcon="flag"
          />
          <Menu.Item
            onPress={() => handleSortChange("dueDate")}
            title="Due Date"
            leadingIcon="calendar-clock"
          />
          <Menu.Item
            onPress={() => handleSortChange("alphabetical")}
            title="Alphabetical"
            leadingIcon="alphabetical"
          />
          <Divider />
          <Menu.Item
            onPress={toggleSortOrder}
            title={
              activeFilters.sortOrder === "asc" ? "Ascending" : "Descending"
            }
            leadingIcon={
              activeFilters.sortOrder === "asc" ? "arrow-up" : "arrow-down"
            }
          />
        </Menu>

        {activeFilterCount > 0 && (
          <Chip
            icon="filter-remove"
            onPress={clearAllFilters}
            style={styles.chip}
          >
            Clear ({activeFilterCount})
          </Chip>
        )}
      </View>
    </View>
  );
};

const getSortLabel = (sortBy: FilterOptions["sortBy"]): string => {
  switch (sortBy) {
    case "created":
      return "Date";
    case "priority":
      return "Priority";
    case "dueDate":
      return "Due Date";
    case "alphabetical":
      return "A-Z";
    default:
      return "Date";
  }
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 0,
  },
  filtersRow: {
    marginBottom: 8,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    marginRight: 0,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  actionsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 8,
  },
});
