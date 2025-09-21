import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function PathBriefTab({ path }) {
  console.log(path);
  const { name, description, profile, distance, duration } = path;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name.toUpperCase()}</CardTitle>
        <CardDescription>Type: {profile[0].toUpperCase().concat(profile.slice(1))}</CardDescription>
        <CardDescription>Distance: {distance} meters</CardDescription>
        <CardDescription>Duration: {duration} mins</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Path Description</p>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export default PathBriefTab;
