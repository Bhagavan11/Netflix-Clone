import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

// Search Person
export async function searchPerson(req, res) {
    const { query } = req.params;
    console.log("Query in search person controller:", query);

    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`);
        console.log("Search person response:", response);
        if (!response || !response.results || response.results.length === 0) {
            return res.status(404).send(null);
        }
        console.log("req.user._id",req.user._id)

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: response.results[0].id,  
                    image: response.results[0].profile_path,
                    title: response.results[0].name,
                    searchType: "person",
                    createdAt: new Date()
                }
            }
        }).exec();

        res.status(200).json({ success: true, content: response.results });
    } catch (error) {
        console.error("Error in search person controller:", error);
        res.status(500).json({ success: false, message: "INTERNAL SERVER ERROR" });
    }
}

// Search Movie
export async function searchMovie(req, res) {
    const { query } = req.params;

    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`);

        if (!response || !response.results || response.results.length === 0) {
            return res.status(404).send(null);
        }

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: response.results[0].id,
                    image: response.results[0].poster_path,
                    title: response.results[0].title,
                    searchType: "movie",
                    createdAt: new Date()
                }
            }
        }).exec();

        res.status(200).json({ success: true, content: response.results });
    } catch (error) {
        console.error("Error in search movie controller:", error);
        res.status(500).json({ success: false, message: "INTERNAL SERVER ERROR" });
    }
}

// Search TV
export async function searchTv(req, res) {
    const { query } = req.params;

    try {
        const response = await fetchFromTMDB(`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`);

        if (!response || !response.results || response.results.length === 0) {
            return res.status(404).send(null);
        }

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: response.results[0].id,
                    image: response.results[0].poster_path,
                    title: response.results[0].name,
                    searchType: "tv",
                    createdAt: new Date()
                }
            }
        }).exec();

        res.status(200).json({ success: true, content: response.results });
    } catch (error) {
        console.error("Error in search tv show controller:", error);
        res.status(500).json({ success: false, message: "INTERNAL SERVER ERROR" });
    }
}

// Get Search History
export async function getSearchHistory(req, res) {
    try {
        console.log(req.user.SearchHistory )

        res.status(200).json({ success: true, content: req.user.searchHistory });
    } catch (error) {
        console.error("Error in get search history controller:", error);
        res.status(500).json({ success: false, message: "INTERNAL SERVER ERROR" });
    }
}

// Delete Search History Item
export async function deleteItemFromSearchHistory(req, res) {
    let { id } = req.params;
    id=parseInt(id);

    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                searchHistory: { id: id }
            }
        }).exec();

        res.status(200).json({ success: true, message: "SEARCH HISTORY DELETED SUCCESSFULLY" });
    } catch (error) {
        console.error("Error in delete search history controller:", error);
        res.status(500).json({ success: false, message: "INTERNAL SERVER ERROR" });
    }
}
