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
import ProjectsModal from "./modal/ProjectModal";

// Transition untuk animasi dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // State untuk dialog konfirmasi hapus
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    project: null,
  });

  // Ambil data projects dari Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const projectsRef = collection(db, "projects");
        const q = query(projectsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const projectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setSnackbar({
          open: true,
          message: `Error mengambil data project: ${error.message}`,
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const openModal = (project = null) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };

  // Buka dialog konfirmasi hapus
  const openDeleteDialog = (project) => {
    setDeleteDialog({
      open: true,
      project: project,
    });
  };

  // Tutup dialog konfirmasi hapus
  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      project: null,
    });
  };

  // Tambah project baru ke Firestore
  const addProject = async (project) => {
    try {
      const projectData = {
        title: project.title,
        type: project.type,
        description: project.description || "", // Tambahkan description
        imageUrl: project.imageUrl || "",
        createdAt: Timestamp.now(),
      };

      const projectsRef = collection(db, "projects");
      const docRef = await addDoc(projectsRef, projectData);

      setProjects((prevProjects) => [
        {
          id: docRef.id,
          ...projectData,
        },
        ...prevProjects,
      ]);

      setSnackbar({
        open: true,
        message: "Project berhasil ditambahkan",
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding project:", error);
      setSnackbar({
        open: true,
        message: `Error menambahkan project: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Update project yang ada di Firestore
  const updateProject = async (updatedProject) => {
    try {
      const projectData = {
        title: updatedProject.title,
        type: updatedProject.type,
        description: updatedProject.description || "", // Tambahkan description
        imageUrl: updatedProject.imageUrl || "",
        updatedAt: Timestamp.now(),
      };

      const projectRef = doc(db, "projects", updatedProject.id);
      await updateDoc(projectRef, projectData);

      setProjects((prevProjects) =>
        prevProjects.map((proj) =>
          proj.id === updatedProject.id
            ? { ...projectData, id: updatedProject.id }
            : proj
        )
      );

      setSnackbar({
        open: true,
        message: "Project berhasil diperbarui",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating project:", error);
      setSnackbar({
        open: true,
        message: `Error memperbarui project: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Handle simpan (add atau update)
  const handleSave = (project) => {
    if (project.id) {
      updateProject(project);
    } else {
      addProject(project);
    }
    closeModal();
  };

  // Hapus project dari Firestore
  const handleDelete = async () => {
    try {
      const projectToDelete = deleteDialog.project;
      if (!projectToDelete) return;

      await deleteDoc(doc(db, "projects", projectToDelete.id));

      setProjects((prevProjects) =>
        prevProjects.filter((proj) => proj.id !== projectToDelete.id)
      );

      setSnackbar({
        open: true,
        message: "Project berhasil dihapus",
        severity: "success",
      });

      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting project:", error);
      setSnackbar({
        open: true,
        message: `Error menghapus project: ${error.message}`,
        severity: "error",
      });
      closeDeleteDialog();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-color1 text-2xl md:text-3xl font-bold">Projects</h1>
        <button
          onClick={() => openModal()}
          className="bg-color1 text-black text-sm md:text-md px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center"
        >
          <FaPlus className="mr-2" size={15} />
          Tambah Project
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-color1"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#1E1E1E] rounded-lg p-8 text-center">
          <p className="text-gray-300">
            Belum ada project. Tambahkan project pertama Anda!
          </p>
        </div>
      ) : (
        <div className="bg-[#1E1E1E] rounded-lg p-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  <td className="p-4">{project.title}</td>
                  <td className="p-4">{project.type}</td>
                  <td className="p-4">{project.description || "-"}</td>
                  <td className="p-4">
                    {project.imageUrl && (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => openModal(project)}
                        className="text-gray-400 hover:text-color1 transition-colors"
                      >
                        <FaEdit size={25} />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(project)}
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
        <ProjectsModal
          project={currentProject}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}

      {/* Dialog Konfirmasi Hapus */}
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
        <DialogTitle id="alert-dialog-title">
          {"Konfirmasi Penghapusan"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "#f8f8f8" }}
          >
            Apakah Anda yakin ingin menghapus project ini? Tindakan ini tidak
            dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Batal</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar untuk notifikasi */}
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

export default ProjectsPage;
