import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaGripVertical } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Slide,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ExperienceModal from "./modal/ExperiencesModal";
import AddButton from "../components/AddButton";
import { experiencesAPI } from "../api";

// Slide transition component for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Sortable Table Row Component
const SortableRow = ({ experience, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: experience._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
    >
      <td className="p-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-color1"
        >
          <FaGripVertical size={20} />
        </div>
      </td>
      <td className="p-4 text-center">{experience.order + 1}</td>
      <td className="p-4">{experience.period || "N/A"}</td>
      <td className="p-4">{experience.title}</td>
      <td className="p-4">{experience.company}</td>
      <td className="p-4 text-right">
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => onEdit(experience)}
            className="text-gray-400 hover:text-color1 transition-colors cursor-pointer"
          >
            <FaEdit size={25} />
          </button>
          <button
            onClick={() => onDelete(experience)}
            className="text-red-500 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <FaTrash size={25} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // State for delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    experience: null,
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = experiences.findIndex((exp) => exp._id === active.id);
    const newIndex = experiences.findIndex((exp) => exp._id === over.id);

    // Update local state immediately for better UX
    const newExperiences = arrayMove(experiences, oldIndex, newIndex);
    setExperiences(newExperiences);

    // Update orders in the database
    try {
      const updatedOrders = newExperiences.map((exp, index) => ({
        _id: exp._id,
        order: index,
      }));

      const response = await experiencesAPI.updateOrder(updatedOrders);

      if (response.success) {
        setSnackbar({
          open: true,
          message: "Order updated successfully",
          severity: "success",
        });
        // Update with server response to ensure consistency
        setExperiences(response.data);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      setSnackbar({
        open: true,
        message: `Error updating order: ${error.message}`,
        severity: "error",
      });
      // Revert to previous state on error
      reloadExperiences();
    }
  };

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        setIsLoading(true);
        const response = await experiencesAPI.getAll({
          sortBy: "order",
          sortOrder: "asc",
        });
        if (response.success) {
          setExperiences(response.data);
        }
      } catch (error) {
        console.error("Error loading experiences:", error);
        setSnackbar({
          open: true,
          message: `Error loading experiences: ${error.message}`,
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadExperiences();
  }, []);

  const reloadExperiences = async () => {
    try {
      setIsLoading(true);
      const response = await experiencesAPI.getAll({
        sortBy: "order",
        sortOrder: "asc",
      });
      if (response.success) {
        setExperiences(response.data);
      }
    } catch (error) {
      console.error("Error reloading experiences:", error);
      setSnackbar({
        open: true,
        message: `Error reloading: ${error.message}`,
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (experience = null) => {
    setCurrentExperience(experience);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentExperience(null);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (experience) => {
    setDeleteDialog({
      open: true,
      experience: experience,
    });
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      experience: null,
    });
  };

  // Handle save (add or update)
  const handleSave = async (experience) => {
    try {
      let response;
      if (experience._id) {
        // Update existing experience
        response = await experiencesAPI.update(experience._id, experience);
        setSnackbar({
          open: true,
          message: "Experience updated successfully",
          severity: "success",
        });
      } else {
        // Create new experience
        response = await experiencesAPI.create(experience);
        setSnackbar({
          open: true,
          message: "Experience added successfully",
          severity: "success",
        });
      }
      closeModal();
      // Reload experiences to reflect the new order
      reloadExperiences();
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Delete experience
  const handleDelete = async () => {
    try {
      const experienceToDelete = deleteDialog.experience;
      if (!experienceToDelete) return;

      const response = await experiencesAPI.delete(experienceToDelete._id);

      if (response.success) {
        setExperiences((prevExperiences) =>
          prevExperiences.filter((exp) => exp._id !== experienceToDelete._id)
        );

        setSnackbar({
          open: true,
          message: "Experience deleted successfully",
          severity: "success",
        });
      } else {
        throw new Error(response.message || "Delete failed");
      }

      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting experience:", error);
      setSnackbar({
        open: true,
        message: `Error deleting experience: ${error.message}`,
        severity: "error",
      });
      closeDeleteDialog();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-color1 text-2xl md:text-3xl font-bold">
          Experiences
        </h1>
        <div className="flex items-center space-x-4">
          <MdRefresh
            size={25}
            className="text-color1 cursor-pointer"
            onClick={reloadExperiences}
          />
          <AddButton onClick={() => openModal()} label="Add Experience" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color1"></div>
        </div>
      ) : experiences.length === 0 ? (
        <div className="bg-[#1E1E1E] rounded-lg p-8 text-center">
          <p className="text-gray-300">
            No experiences found. Add your first one!
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="bg-[#1E1E1E] rounded-lg scrollbar p-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="p-4"></th>
                  <th className="p-4 text-center">Order</th>
                  <th className="p-4 text-left">Period</th>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Company</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <SortableContext
                  items={experiences.map((exp) => exp._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {experiences.map((experience) => (
                    <SortableRow
                      key={experience._id}
                      experience={experience}
                      onEdit={openModal}
                      onDelete={openDeleteDialog}
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </div>
        </DndContext>
      )}

      {isModalOpen && (
        <ExperienceModal
          experience={currentExperience}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#121212", // Dark background
            color: "#c5f82a",
          },
        }}
        open={deleteDialog.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "#f8f8f8" }}
          >
            Are you sure you want to delete this experience? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={loadingDelete}>
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setLoadingDelete(true);
              await handleDelete();
              setLoadingDelete(false);
            }}
            color="error"
            autoFocus
            disabled={loadingDelete}
          >
            {loadingDelete ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ExperiencesPage;
