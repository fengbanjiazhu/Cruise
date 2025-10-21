import { NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../../store/slices/userInfoSlice";
import { useDispatch } from "react-redux";
import { LogOut, UserPen, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

function ProfileBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(removeUser());
    navigate("/");
  };

  return (
    <ButtonGroup className="leading-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-transparent py-2 px-4 my-auto" variant="ghost" size="icon">
            <UserCog />
          </Button>
        </DropdownMenuTrigger>
        {/*  */}
        <DropdownMenuContent align="end" className="mt-1 z-[1005]">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserPen />
              <NavLink to="/profile">Profile</NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              <a onClick={logout} role="button">
                Logout
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

export default ProfileBtn;
