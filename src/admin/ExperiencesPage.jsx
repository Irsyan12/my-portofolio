import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
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
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import ExperienceModal from "./modal/ExperiencesModal";
import AddButton from "../components/AddButton";

// Slide transition component for the dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch experiences from Firestore
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setIsLoading(true);
        const experiencesRef = collection(db, "experiences");
        const q = query(experiencesRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const experiencesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setExperiences(experiencesData);
      } catch (error) {
        console.error("Error fetching experiences:", error);
        setSnackbar({
          open: true,
          message: `Error fetching experiences: ${error.message}`,
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

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

  // Add a new experience to Firestore
  const addExperience = async (experience) => {
    try {
      // Create a data object without startMonth, startYear, endMonth, endYear
      const experienceData = {
        period: experience.period,
        role: experience.role,
        company: experience.company,
        description: experience.description,
        createdAt: Timestamp.now(),
      };

      const experiencesRef = collection(db, "experiences");
      const docRef = await addDoc(experiencesRef, experienceData);

      // Update the experiences state with the new experience including its ID
      setExperiences((prevExperiences) => [
        {
          id: docRef.id,
          ...experienceData,
        },
        ...prevExperiences,
      ]);

      setSnackbar({
        open: true,
        message: "Experience added successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding experience:", error);
      setSnackbar({
        open: true,
        message: `Error adding experience: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Update an existing experience in Firestore
  const updateExperience = async (updatedExperience) => {
    try {
      // Create a data object without startMonth, startYear, endMonth, endYear, id
      const experienceData = {
        period: updatedExperience.period,
        role: updatedExperience.role,
        company: updatedExperience.company,
        description: updatedExperience.description,
        updatedAt: Timestamp.now(),
      };

      const experienceRef = doc(db, "experiences", updatedExperience.id);
      await updateDoc(experienceRef, experienceData);

      // Update the experiences state
      setExperiences((prevExperiences) =>
        prevExperiences.map((exp) =>
          exp.id === updatedExperience.id
            ? { ...experienceData, id: updatedExperience.id }
            : exp
        )
      );

      setSnackbar({
        open: true,
        message: "Experience updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating experience:", error);
      setSnackbar({
        open: true,
        message: `Error updating experience: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Handle save (add or update)
  const handleSave = (experience) => {
    if (experience.id) {
      updateExperience(experience);
    } else {
      addExperience(experience);
    }
    closeModal();
  };

  // Delete experience from Firestore
  const handleDelete = async () => {
    try {
      const experienceToDelete = deleteDialog.experience;
      if (!experienceToDelete) return;

      await deleteDoc(doc(db, "experiences", experienceToDelete.id));

      // Update the experiences state
      setExperiences((prevExperiences) =>
        prevExperiences.filter((exp) => exp.id !== experienceToDelete.id)
      );

      setSnackbar({
        open: true,
        message: "Experience deleted successfully",
        severity: "success",
      });

      // Close the dialog
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting experience:", error);
      setSnackbar({
        open: true,
        message: `Error deleting experience: ${error.message}`,
        severity: "error",
      });
      // Close the dialog even if there's an error
      closeDeleteDialog();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-color1 text-2xl md:text-3xl font-bold">
          Experiences
        </h1>
        <AddButton onClick={() => openModal()} label="Add Experience" />
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
          <DialogContentText id="alert-dialog-description" sx={{ color: "#f8f8f8" }}>
            Are you sure you want to delete this experience? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
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
