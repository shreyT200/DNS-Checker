import React from "react";
import {
    Box,
    AppBar,
    CssBaseline,
    Divider,
    Toolbar,

} from "@mui/material"
export default function Navbar({childern}){
    return(
        <Box>
            <CssBaseline>
                <AppBar position="fixed" >
                    <Toolbar>
{childern}
                    </Toolbar>
                </AppBar>
            </CssBaseline>
        </Box>
    )
}