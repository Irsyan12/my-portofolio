import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
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
import ExperienceModal from "./modal/ExperiencesModal";
import AddButton from "../components/AddButton";
import {
  fetchExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
} from "../firebase/experiencesService";

// Slide transition component for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        setIsLoading(true);
        const experiencesData = await fetchExperiences(); // Already sorted by Firestore
        setExperiences(experiencesData);
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
      const experiencesData = await fetchExperiences(); // Already sorted by Firestore
      setExperiences(experiencesData);
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
      if (experience.id) {
        await updateExperience(experience);
        setSnackbar({
          open: true,
          message: "Experience updated successfully",
          severity: "success",
        });
      } else {
        const newExperience = await addExperience(experience);
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

  const handleOrderChange = async (experienceId, newOrderValue) => {
    setIsLoading(true); // Indicate loading for the whole table

    const currentExp = experiences.find((exp) => exp.id === experienceId);
    if (!currentExp) {
      setSnackbar({
        open: true,
        message: "Error: Experience not found.",
        severity: "error",
      });
      setIsLoading(false);
      return;
    }

    // Ensure currentExp.order is a number, default to 0 if undefined/null
    const originalOrderOfCurrentExp =
      currentExp.order === undefined || currentExp.order === null
        ? 0
        : currentExp.order;

    // Find the experience that currently has the newOrderValue (if any)
    const targetExp = experiences.find(
      (exp) => exp.id !== experienceId && exp.order === newOrderValue
    );

    try {
      const updatePromises = [];

      // Update the current experience to the new order
      updatePromises.push(
        updateExperience({ ...currentExp, order: newOrderValue })
      );

      // If there's a target experience (another item has the newOrderValue),
      // update its order to the original order of the current experience.
      if (targetExp) {
        updatePromises.push(
          updateExperience({ ...targetExp, order: originalOrderOfCurrentExp })
        );
      }

      await Promise.all(updatePromises);

      setSnackbar({
        open: true,
        message: "Order updated successfully. Reloading...",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating order:", error);
      setSnackbar({
        open: true,
        message: `Error updating order: ${error.message}`,
        severity: "error",
      });
    } finally {
      // Reload experiences from Firestore to get the canonical sorted state
      await reloadExperiences(); // This also sets setIsLoading(false)
    }
  };

  // Delete experience from Firestore
  const handleDelete = async () => {
    try {
      const experienceToDelete = deleteDialog.experience;
      if (!experienceToDelete) return;

      await deleteExperience(experienceToDelete.id);

      setExperiences((prevExperiences) =>
        prevExperiences.filter((exp) => exp.id !== experienceToDelete.id)
      );

      setSnackbar({
        open: true,
        message: "Experience deleted successfully",
        severity: "success",
      });

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
        <div className="bg-[#1E1E1E] rounded-lg scrollbar p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-4 text-left">Order</th>
                <th className="p-4 text-left">Period</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((experience) => (
                <tr
                  key={experience.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  <td className="p-4">
                    <select
                      value={
                        experience.order !== undefined &&
                        experience.order !== null
                          ? experience.order
                          : 0
                      }
                      onChange={(e) =>
                        handleOrderChange(
                          experience.id,
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="bg-dark text-white border border-gray-700 rounded-md p-1 text-sm focus:ring-color1 focus:border-color1 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      {Array.from(
                        { length: experiences.length + 1 },
                        (_, i) => i
                      ).map((orderValue) => (
                        <option key={orderValue} value={orderValue}>
                          {orderValue}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">{experience.period}</td>
                  <td className="p-4">{experience.role}</td>
                  <td className="p-4">{experience.company}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => openModal(experience)}
                        className="text-gray-400 hover:text-color1 transition-colors"
                      >
                        <FaEdit size={25} />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(experience)}
                        className="text-red-500 hover:opacity-80 transition-opacity"
                      >
                        <FaTrash size={25} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
