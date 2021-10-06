import React from "react";
import { Link } from "react-router-dom";

type Props = {
    link: string;
    linktext: string;
}

const Filters = ({link, linktext}: Props) => (
    <div className="filters-container records-actions">
    <Link to={link}>
        <button className="action-filters">
            {linktext}
        </button>
    </Link>
</div>

);

export default Filters;