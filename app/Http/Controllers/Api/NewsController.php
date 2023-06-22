<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NewsController extends Controller
{

    /**
     * Build api target from given source shortcode
     *
     * @param Request $request
     * @param string $query
     * @param string $source
     * @param string $cat
     * @param string $page
     * @param array $more
     * 
     * @return string $endpoint
     */
    protected function buildEndpoint( 
        $request, 
        $query = "", 
        $source="",
        $cat = "",
        $page=1,
        $more = [] ) 
        {
        $defaults   = [
            "source" => "nyn",
            "category" => $cat,
            "type" => "",
            "date" => "",
            "target" => "",
            "relevance" => ""
        ];

        $user       = $request->user();
        $prefs      = !empty($user)? $user->preferences: $defaults;

        // Check, merge also costs
        if ( !empty($more) ) {
            $prefs  = array_merge( $prefs, $more);
        } else {
            $prefs  = array_merge( $defaults, $prefs);
        }

        $target     = strtoupper(strlen($source)? $source : ($prefs["source"]));
        $cat        = strlen($cat)? $cat : $prefs["category"];
        $key_name   = "api-key";
        $date       = $prefs["date"];
        $sort_val   = $prefs["relevance"];

        $selected_src= $prefs["target"];

        // Get the name of category, or get default
        $cat_key    = env("NEWS_{$target}_CAT", "news_desk");
        $date_key   = env("NEWS_{$target}_DATE_KEY");
        $source_key = env("NEWS_{$target}_SOURCE_KEY");
        $sort_key   = env("NEWS_{$target}_SORT_KEY");
       

        $filter     = strlen($cat) ? "fq={$cat_key}:{$cat}" : "";

        if( strlen($selected_src) ) {
            $filter .= strlen($cat) ? " AND {$source_key}:{$selected_src}": "fq={$source_key}:{$selected_src}";
        }
        
        if ($target === "GUA") {
            $filter = "{$cat_key}={$cat}&show-fields=headline,byline,standfirst,thumbnail,body";
        }

        if( $target === "NEWS") {
            $key_name = "apiKey";

            // Make this default for
            if ( !strlen($selected_src))
                $selected_src = "bbc-news";

            // Make this fields correspond to user menu
            if ( strlen($sort_val)) {
                if ($sort_val === "relevance")
                    $sort_val = "popularity";
                else if ($sort_val === "newest")
                    $sort_val = "relevancy";
                else $sort_val = "publishedAt";
            }


            $filter = "{$source_key}={$selected_src}&pageSize=10";
        }

        // Date must be available, otherwise NYN will show java error
        if ( strlen($date) && ! ($target === "NYN" && $selected_src )) {
            $filter .= "&{$date_key}=$date";
        }

        if (strlen($sort_val)) {
            $filter .= "&{$sort_key}={$sort_val}";
        }

        // Get the source from environment variables
        $source     = env("NEWS_{$target}_API");
        $key        = env("NEWS_{$target}_KEY");
        $filter     .= "&";
        

        // Build endpoint
        $endpoint   = $source . $query . "&{$filter}page={$page}&{$key_name}=" . $key;

        return $endpoint;
    }

    /**
     * Gets all news from chosen API
     * 
     * @param Request $request
     * @return json
     */
    public function index(Request $request) 
    {

        $endpoint   = $this->buildEndpoint($request);
        $response = Http::get( $endpoint );
        return response($response->json());
    }

    /**
     * Gets all news from chosen category
     * 
     * @param Request $request
     * @return json 
     */
    public function category(Request $request) 
    {
        $endpoint   = $this->buildEndpoint(
                        $request, 
                        "", 
                        $request->source, 
                        $request->category,
                        $request->page
                    );

        $response = Http::get( $endpoint );
        return response($response->json());
    }

    /**
     * Get the date based on the date parameter for API
     *
     * @param string $date
     * @param string $src
     * @return string $date
     */
    public function getDate($date = "", $src = "") {
        
        $d = "";
        
        if ( strlen( $date ) ) {
           $d = date("Y-m-d", strtotime($date));
        }
        
        if ($src === "nyn") {
            $d = str_replace("-", "", $d);
        }

        return $d;
    }

    /**
     * Filter request by provided multiple parameters
     *
     * @param Request $request
     * @return json
     */
    public function filter(Request $request) 
    {
        $defaults   = [
            "source" => "nyn",
            "category" => "",
            "date" => "",
            "target" => "",
            "relevance" => ""
        ];
        $fields     = $request->all();
        $filters    = array_merge($defaults, $fields);

        $date       = $this->getDate( $filters["date"], $filters["source"] );
        $filters["date"] = $date;

        $endpoint = $this->buildEndpoint( $request, "", $filters["source"], $filters["category"], 1, $filters );

        $response = Http::get( $endpoint );
        return response($response->json());
    }

    
    /**
     * Gets all news from chosen category
     * 
     * @param Request $request
     * @return json
     */
    public function search(Request $request) 
    {

        $endpoint   = $this->buildEndpoint(
                        $request, 
                        $request->term, 
                        $request->source,
                        "",
                        $request->page
                    );

        $response = Http::get( $endpoint );
        return response($response->json());
    }
}
