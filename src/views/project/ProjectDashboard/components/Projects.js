import React from "react";
import { Card, Button } from "components/ui";
import { useNavigate } from "react-router-dom";

const Projects = ({ data = [] }) => {
  const navigate = useNavigate();

  const onViewAllProjects = () => {
    navigate("/app/project/project-list");
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h4>Projects</h4>
        <Button onClick={onViewAllProjects} size="sm">
          View All
        </Button>
      </div>
    </Card>
  );
};

export default Projects;
