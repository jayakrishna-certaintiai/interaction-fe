import { useContext, useEffect, useState } from "react";
import { useHasAccessToFeature } from "../../utils/helper/HasAccessToFeature";
import { Paper } from "@mui/material";
import ProjectsTeamTableStack from "../../components/ProjectsTeams/ProjectsTeamTableStack";
import { ProjectTeammemberContext } from "../../context/ProjectTeammemberContext";

const chartPaperStyle = {
  p: 1,
  flex: 1,
  borderRadius: "20px",
  height: "300px",
  boxShadow: "0px 3px 6px #0000001F",
};

const layoutBoxStyle = {
  width: "98%",
  mx: "auto",
  display: "flex",
  mt: 2,
  gap: "20px",
};

function ProjectsTeam() {
  const loading = false;
  const { getProjectsTeamMembers } = useContext(ProjectTeammemberContext);

  useEffect(() => {
    getProjectsTeamMembers();
  }, [])
  return (
    <>
      {useHasAccessToFeature("F018", "P000000003") && (
        <Paper
          sx={{
            width: "98.5%",
            mx: "auto",
            mt: 1,
            borderRadius: "25px",
            mb: 3,
            boxShadow: "0px 3px 6px #0000001F",
          }}
        >
          <ProjectsTeamTableStack loading={loading} />
        </Paper>
      )}
    </>
  );
}

export default ProjectsTeam;